package com.tcg.controller;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

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
import com.tcg.entity.News;
import com.tcg.entity.Order;
import com.tcg.entity.Site;
import com.tcg.entity.UserInfo;
import com.tcg.service.MessageService;
import com.tcg.service.NewsService;
import com.tcg.service.OrderService;
import com.tcg.service.SiteService;
import com.tcg.service.UserInfoService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author tcg
 *
 */


@Controller
@Api(tags = "管理员接口")
@RequestMapping("/admin")
public class AdminController
{
	private static String success = "success";
	private static String fail = "fail";
	@Autowired
	UserInfoService userInfoService;
	@Autowired
	SiteService siteService;
	@Autowired
	OrderService orderService;
	@Autowired
	NewsService newsService;
	@Autowired
	MessageService messageService;
	
	@GetMapping("/users")
	@ApiOperation(value = "获取所有用户列表")
	@ResponseBody
	public String users()
	{
		List<UserInfo> userInfos = userInfoService.findAllUsers();
		return JSON.toJSONString(userInfos);
	}
	
	@PostMapping("/users/update/{username}")
	@ApiOperation(value = "更改用户信息")
	@ApiImplicitParams({
		@ApiImplicitParam(name = "password",required = true,paramType = "query"),
		@ApiImplicitParam(name = "email",required = true,paramType = "query"),
		@ApiImplicitParam(name = "telephone",required = true,paramType = "query")
	})
	@ResponseBody
	public String userUpdate(
			@PathVariable("username") String username,
			@RequestParam("password") String password,
			@RequestParam("email") String email,
			@RequestParam("telephone") String telephone
	)
	{
		UserInfo userInfo = userInfoService.findUserByUsername(username);
		if(userInfo == null)
		{
			return fail;
		}
		userInfo.setEmail(email);
		password = new BCryptPasswordEncoder().encode(password);
		userInfo.setPassword(password);
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
	
	@DeleteMapping("/users/delete/{username}")
	@ApiOperation(value = "删除用户")
	@ResponseBody
	public String userDelete(@PathVariable("username") String username)
	{
		int t = userInfoService.deleteUserByUsername(username);
		
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@DeleteMapping("/sites/delete/{siteId}")
	@ApiOperation(value = "删除场馆")
	@ResponseBody
	public String siteDelete(@PathVariable("siteId") int siteId)
	{
		int t = siteService.deleteSiteById(siteId);
		
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	@PostMapping("/sites/add")
	@ApiOperation(value = "添加场馆")
	@ResponseBody
	@ApiImplicitParams({
		@ApiImplicitParam(name = "name",required = true,paramType = "query"),
		@ApiImplicitParam(name = "imagePath",required = true,paramType = "query"),
		@ApiImplicitParam(name = "description",required = true,paramType = "query"),
		@ApiImplicitParam(name = "location",required = true,paramType = "query"),
		@ApiImplicitParam(name = "price",required = true,paramType = "query",dataType = "double")
	})
	public String siteAdd(
			@RequestParam("name") String name,
			@RequestParam("imagePath") String imagePath,
			@RequestParam("description") String description,
			@RequestParam("location") String location,
			@RequestParam("price") double price
	) throws IOException
	{
		Site site = new Site();
		site.setDescription(description);
		site.setImagePath(returnImagePath(imagePath));
		site.setLocation(location);
		site.setName(name);
		site.setPrice(price);
		
		int t = siteService.insertSite(site);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@PostMapping("/sites/update/{siteId}")
	@ApiOperation(value = "修改场馆信息")
	@ResponseBody
	@ApiImplicitParams({
		@ApiImplicitParam(name = "name",required = true,paramType = "query"),
		@ApiImplicitParam(name = "imagePath",required = true,paramType = "query"),
		@ApiImplicitParam(name = "description",required = true,paramType = "query"),
		@ApiImplicitParam(name = "location",required = true,paramType = "query"),
		@ApiImplicitParam(name = "price",required = true,paramType = "query",dataType = "double")
	})
	public String siteUpdate(
			@PathVariable("siteId") int siteId,
			@RequestParam("name") String name,
			@RequestParam("imagePath") String imagePath,
			@RequestParam("description") String description,
			@RequestParam("location") String location,
			@RequestParam("price") double price
	) throws IOException
	{
		Site site = siteService.findSiteById(siteId);
		site.setDescription(description);
		site.setImagePath(returnImagePath(imagePath));
		site.setLocation(location);
		site.setName(name);
		site.setPrice(price);
		
		int t = siteService.updateSiteById(site);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@GetMapping("/orders")
	@ApiOperation(value = "获取所有订单")
	@ResponseBody
	public String ordersAll()
	{
		List<Order> orders = orderService.findAllOrders();
		
		return JSON.toJSONString(orders);
	}
	
	@DeleteMapping("/orders/delete/{orderId}")
	@ApiOperation(value = "删除订单")
	@ResponseBody
	public String orderDelete(@PathVariable("orderId") int orderId)
	{
		int t = orderService.deleteOrderById(orderId);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@PostMapping("/news/add")
	@ResponseBody
	@ApiOperation(value = "新增新闻")
	@ApiImplicitParams({
		@ApiImplicitParam(name = "title",required = true,paramType = "query"),
		@ApiImplicitParam(name = "content",required = true,paramType = "query"),
		@ApiImplicitParam(name = "imagePath",required = true,paramType = "query"),
		@ApiImplicitParam(name = "releaseTime",required = true,paramType = "query"),
	})
	public String newsAdd(
			@RequestParam("title") String title,
			@RequestParam("content") String content,
			@RequestParam("imagePath") String imagePath,
			@RequestParam("releaseTime") String releaseTime
	) throws IOException
	{
		News news = new News();
		news.setTitle(title);
		news.setContent(content);
		news.setImagePath(returnImagePath(imagePath));
		news.setReleaseTime(Timestamp.valueOf(releaseTime));
		int t = newsService.insertNews(news);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@PostMapping("/news/update/{newsId}")
	@ResponseBody
	@ApiOperation(value = "更改新闻")
	@ApiImplicitParams({
		@ApiImplicitParam(name = "title",required = true,paramType = "query"),
		@ApiImplicitParam(name = "content",required = true,paramType = "query"),
		@ApiImplicitParam(name = "imagePath",required = true,paramType = "query"),
		@ApiImplicitParam(name = "releaseTime",required = true,paramType = "query"),
	})
	public String newsUpdate(
			@PathVariable("newsId") int newsId,
			@RequestParam("title") String title,
			@RequestParam("content") String content,
			@RequestParam("imagePath") String imagePath,
			@RequestParam("releaseTime") String releaseTime
	) throws IOException
	{
		News news = newsService.findNewsById(newsId);
		news.setContent(content);
		news.setTitle(title);
		news.setImagePath(returnImagePath(imagePath));
		news.setReleaseTime(Timestamp.valueOf(releaseTime));
		int t = newsService.updateNewsById(news);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@DeleteMapping("/news/delete/{newsId}")
	@ResponseBody
	@ApiOperation(value = "删除新闻")
	public String newsDelete(@PathVariable("newsId") int newsId)
	{
		int t = newsService.deleteNewsById(newsId);
		if(t == 1)
		{
			return success;
		}
		else 
		{
			return fail;
		}
	}
	
	@DeleteMapping("/messages/delete/{messageId}")
	@ResponseBody
	@ApiOperation(value = "删除留言")
	public String messageDelete(@PathVariable("messageId") int messageId)
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
	
	@GetMapping("/{html}")
	public String redirect(@PathVariable("html") String html)
	{
		return html;
	}
	
	private static String rootPath = "src/main/resources/images/";
	@ApiIgnore
	private String returnImagePath(String imageBase64) throws IOException
	{
		if(imageBase64 == null || imageBase64.equals(""))
		{
			return "";
		}
		
		Date date = new Date();
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy_MM_dd_HH_MM_SS");
		
		String imageName = rootPath + sdf2.format(date) + ".txt";
		File fileSaver = new File(imageName);
		
		FileWriter writer = null;
		
		if(fileSaver.createNewFile())
		{
			writer = new FileWriter(fileSaver, true);
			try
			{	
		        writer.append(imageBase64);
		        writer.flush();
		        
			} finally
			{
				writer.close();
			}

		}

		
		return imageName;
	}
}
