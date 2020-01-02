package com.tcg.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.alibaba.fastjson.JSON;
import com.tcg.entity.Message;
import com.tcg.entity.News;
import com.tcg.entity.Order;
import com.tcg.entity.UserInfo;
import com.tcg.service.MessageService;
import com.tcg.service.OrderService;
import com.tcg.service.UserInfoService;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = UserController.class)
class UserControllerTest
{
	@Autowired
	private MockMvc mockmvc;
	
	@MockBean
	private UserInfoService userInfoService;
	@MockBean
	private MessageService messageService;
	@MockBean
	private OrderService orderService;

	@Test
	@WithAnonymousUser
	public void should_redirect_to_login_html_when_not_login() throws Exception
	{
		mockmvc.perform(get("/user/center/bqx"))
			   .andExpect(status().is3xxRedirection())
			   .andExpect(redirectedUrl("http://localhost/public/login"));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_userInfo() throws Exception
	{
		UserInfo userInfo = new UserInfo();
		when(userInfoService.findUserByUsername("bqx")).thenReturn(userInfo);
		mockmvc.perform(get("/user/center/bqx"))
			   .andExpect(status().isOk())
			   .andExpect(content().string(JSON.toJSONString(userInfo)));
		verify(userInfoService,times(1)).findUserByUsername("bqx");
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_success_when_update_userInfo() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(new UserInfo());
		when(userInfoService.updateUserInfoById(Mockito.any(UserInfo.class))).thenReturn(1);
		mockmvc.perform(post("/user/center/update/bqx")
						.param("email", "1@qq.com")
						.param("telephone", "110"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(userInfoService,times(1)).findUserByUsername("bqx");
		verify(userInfoService,times(1)).updateUserInfoById(Mockito.any(UserInfo.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_fail_when_user_not_exist() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(null);
		when(userInfoService.updateUserInfoById(Mockito.any(UserInfo.class))).thenReturn(1);
		mockmvc.perform(post("/user/center/update/bqx")
						.param("username", "bqx")
						.param("password", "123456")
						.param("email", "1@qq.com")
						.param("telephone", "110"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(userInfoService,times(1)).findUserByUsername("bqx");
		verify(userInfoService,times(0)).updateUserInfoById(Mockito.any(UserInfo.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_fail_when_update_userInfo() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(new UserInfo());
		when(userInfoService.updateUserInfoById(Mockito.any(UserInfo.class))).thenReturn(0);
		mockmvc.perform(post("/user/center/update/bqx")
						.param("username", "bqx")
						.param("password", "123456")
						.param("email", "1@qq.com")
						.param("telephone", "110"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(userInfoService,times(1)).findUserByUsername("bqx");
		verify(userInfoService,times(1)).updateUserInfoById(Mockito.any(UserInfo.class));
	}

	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_user_orders() throws Exception
	{
		UserInfo userInfo = new UserInfo();
		userInfo.setUserId(1);
		when(userInfoService.findUserByUsername("bqx")).thenReturn(userInfo);
		when(orderService.findOrderByUserId(1)).thenReturn(new ArrayList<Order>());
		mockmvc.perform(get("/user/orders/username/bqx"))
			   .andExpect(status().isOk())
			   .andExpect(content().string(JSON.toJSONString(new ArrayList<Order>())));
		verify(userInfoService,times(1)).findUserByUsername("bqx");
		verify(orderService,times(1)).findOrderByUserId(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_site_orders() throws Exception
	{
		when(orderService.findOrderBySiteId(1)).thenReturn(new ArrayList<Order>());
		mockmvc.perform(get("/user/orders/siteId/1"))
		       .andExpect(status().isOk())
		       .andExpect(content().string(JSON.toJSONString(new ArrayList<Order>())));
		verify(orderService,times(1)).findOrderBySiteId(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_success_when_update_order() throws Exception
	{
		when(orderService.updateOrderById(Mockito.any(Order.class))).thenReturn(1);
		when(orderService.findOrderById(1)).thenReturn(new Order());
		mockmvc.perform(post("/user/orders/update/1")
						.param("startTime", "2019-11-11 11:11:11")
						.param("endTime", "2019-11-11 11:11:11")
						.param("state", "1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));	
		verify(orderService,times(1)).findOrderById(1);
		verify(orderService,times(1)).updateOrderById(Mockito.any(Order.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_fail_when_update_order() throws Exception
	{
		when(orderService.updateOrderById(Mockito.any(Order.class))).thenReturn(0);
		when(orderService.findOrderById(1)).thenReturn(new Order());
		mockmvc.perform(post("/user/orders/update/1")
						.param("startTime", "2019-11-11 11:11:11")
						.param("endTime", "2019-11-11 11:11:11")
						.param("state", "1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));	
		verify(orderService,times(1)).findOrderById(1);
		verify(orderService,times(1)).updateOrderById(Mockito.any(Order.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_success_when_reply() throws Exception
	{
		when(messageService.insertMessage(Mockito.any(Message.class))).thenReturn(1);
		mockmvc.perform(post("/user/reply")
						.param("parentId", "1")
						.param("userId", "1")
						.param("content", "hello world!")
						.param("time", "2019-11-11 11:11:11"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(messageService,times(1)).insertMessage(Mockito.any(Message.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_fail_when_reply() throws Exception
	{
		when(messageService.insertMessage(Mockito.any(Message.class))).thenReturn(0);
		mockmvc.perform(post("/user/reply")
						.param("parentId", "1")
						.param("userId", "1")
						.param("content", "hello world!")
						.param("time", "2019-11-11 11:11:11"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(messageService,times(1)).insertMessage(Mockito.any(Message.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_success_when_success_to_delete_message() throws Exception
	{
		when(messageService.deleteMessageById(1)).thenReturn(1);
		mockmvc.perform(delete("/user/reply/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(messageService,times(1)).deleteMessageById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_fail_when_fail_to_delete_message() throws Exception
	{
		when(messageService.deleteMessageById(1)).thenReturn(0);
		mockmvc.perform(delete("/user/reply/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(messageService,times(1)).deleteMessageById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_success_when_reverse_a_site() throws Exception
	{
		when(orderService.insertOrder(Mockito.any(Order.class))).thenReturn(1);
		mockmvc.perform(post("/user/reverse")
						.param("userId", "1")
						.param("siteId", "1")
						.param("startTime", "2019-11-11 11:11:11")
						.param("endTime", "2019-11-11 11:11:11")
						.param("state", "0"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(orderService,times(1)).insertOrder(Mockito.any(Order.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_fail_when_reverse_a_site() throws Exception
	{
		when(orderService.insertOrder(Mockito.any(Order.class))).thenReturn(0);
		mockmvc.perform(post("/user/reverse")
						.param("userId", "1")
						.param("siteId", "1")
						.param("startTime", "2019-11-11 11:11:11")
						.param("endTime", "2019-11-11 11:11:11")
						.param("state", "0"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(orderService,times(1)).insertOrder(Mockito.any(Order.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_required_html() throws Exception
	{
		mockmvc.perform(get("/user/user_info.html"))
			   .andExpect(status().isOk())
			   .andExpect(content().contentType("text/html;charset=UTF-8"));
	}
}
