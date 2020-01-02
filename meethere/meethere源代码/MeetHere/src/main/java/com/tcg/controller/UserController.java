package com.tcg.controller;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.tcg.entity.Message;
import com.tcg.entity.Order;
import com.tcg.entity.UserInfo;
import com.tcg.service.MessageService;
import com.tcg.service.OrderService;
import com.tcg.service.UserInfoService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author tcg
 *
 */


@Controller
@RequestMapping("/user")
@Api(tags = "用户接口")
public class UserController
{
	private static String success = "success";
	private static String fail = "fail";
	@Autowired
	UserInfoService userInfoService;
	@Autowired
	MessageService messageService;
	@Autowired
	OrderService orderService;
	
	@ResponseBody
	@GetMapping("/center/{username}")
	@ApiOperation(value = "用户个人中心",notes = "路径方式传值{username}")
	public String center(@PathVariable("username") String username)
	{
		UserInfo userInfo = userInfoService.findUserByUsername(username);
		
		return JSON.toJSONString(userInfo);
	}
	
	@ResponseBody
	@PostMapping("/center/update/{username}")
	@ApiOperation(value = "更新个人信息",notes = "路径方式传值{username}")
	@ApiImplicitParams({
		@ApiImplicitParam(name = "email",required = true,paramType = "query"),
		@ApiImplicitParam(name = "telephone",required = true,paramType = "query")
	})
	public String centerUpdate(
			@PathVariable("username") String username,
			@RequestParam("email") String email,
			@RequestParam("telephone") String telephone
	)
	{
		UserInfo userInfo = userInfoService.findUserByUsername(username);
		if(userInfo == null)
		{
			return "fail";
		}
		userInfo.setEmail(email);
		userInfo.setTelephone(telephone);
		int t = userInfoService.updateUserInfoById(userInfo);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@ResponseBody
	@GetMapping("/orders/username/{username}")
	@ApiOperation(value = "获取当前用户订单",notes = "路径传值{username}")
	public String orders(@PathVariable("username") String username)
	{
		int userId = userInfoService.findUserByUsername(username).getUserId();
		
		List<Order> orders = orderService.findOrderByUserId(userId);
		
		return JSON.toJSONString(orders);
	}
	
	@ResponseBody
	@GetMapping("/orders/siteId/{siteId}")
	@ApiOperation(value = "获取场馆订单",notes = "路径传值{siteId}")
	public String orderSite(@PathVariable("siteId") int siteId)
	{
		List<Order> orders = orderService.findOrderBySiteId(siteId);
		
		return JSON.toJSONString(orders);
	}
	
	@ResponseBody
	@PostMapping("/orders/update/{orderId}")
	@ApiOperation(value = "更新订单信息",
				  notes = "只能更改时间及状态，路径传值{orderId}")
	@ApiImplicitParams({
		@ApiImplicitParam(name = "startTime",required = true,paramType = "query"),
		@ApiImplicitParam(name = "endTime",required = true,paramType = "query"),
		@ApiImplicitParam(name = "state",required = true,paramType = "query")
	})
	public String ordersUpdate(
			@PathVariable("orderId") int orderId,
			@RequestParam("startTime") String startTime,
			@RequestParam("endTime") String endTime,
			@RequestParam("state") short state
	)
	{
		Order order = orderService.findOrderById(orderId);
		order.setStartTime(Timestamp.valueOf(startTime));
		order.setEndTime(Timestamp.valueOf(endTime));
		order.setState(state);
		
		int t = orderService.updateOrderById(order);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@ResponseBody
	@PostMapping("/reply")
	@ApiOperation(value = "留言",notes = "回复留言，parentId为被回复的留言id；新建留言，parentId为0")
	@ApiImplicitParams({
		@ApiImplicitParam(name = "parentId",required = true,paramType = "query",dataType = "Integer"),
		@ApiImplicitParam(name = "userId",required = true,paramType = "query",dataType = "Integer"),
		@ApiImplicitParam(name = "content",required = true,paramType = "query"),
		@ApiImplicitParam(name = "time",required = true,paramType = "query")
	})
	public String replyMessage(
			@RequestParam("parentId") int parentId,
			@RequestParam("userId") int userId,
			@RequestParam("content") String content,
			@RequestParam("time") String time
	)
	{
		Message message = new Message();
		message.setParentId(parentId);
		message.setUserId(userId);
		message.setContent(content);
		message.setTime(Timestamp.valueOf(time));
		
		int t = messageService.insertMessage(message);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@ResponseBody
	@DeleteMapping("/reply/delete/{messageId}")
	@ApiOperation(value = "删除自己留言")

	public String deleteMessage(@PathVariable("messageId") int messageId)
	{
		int t = messageService.deleteMessageById(messageId);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@ResponseBody
	@PostMapping("/reverse")
	@ApiOperation(value = "预约场馆")
	@ApiImplicitParams({
		@ApiImplicitParam(name = "userId",required = true,paramType = "query",dataType = "Integer"),
		@ApiImplicitParam(name = "siteId",required = true,paramType = "query",dataType = "Integer"),
		@ApiImplicitParam(name = "startTime",required = true,paramType = "query"),
		@ApiImplicitParam(name = "endTime",required = true,paramType = "query"),
		@ApiImplicitParam(name = "state",required = true,paramType = "query",dataType = "short"),
	})
	public String reserveSite(
			@RequestParam("userId") int userId,
			@RequestParam("siteId") int siteId,
			@RequestParam("startTime") String startTime,
			@RequestParam("endTime") String endTime,
			@RequestParam("state") short state
	)
	{
		Order order = new Order();
		order.setUserId(userId);
		order.setSiteId(siteId);
		order.setStartTime(Timestamp.valueOf(startTime));
		order.setEndTime(Timestamp.valueOf(endTime));
		order.setState(state);
		
		int t = orderService.insertOrder(order);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@GetMapping("/{html}")
	public String redirect(@PathVariable("html") String html)
	{
		return html;
	}
}
