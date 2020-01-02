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

import java.sql.Timestamp;
import java.util.ArrayList;

import javax.sound.midi.VoiceStatus;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

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

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = AdminController.class)
class AdminControllerTest
{
	@Autowired
	MockMvc mockMvc;
	
	@MockBean
	UserInfoService userInfoService;
	@MockBean
	SiteService siteService;
	@MockBean
	OrderService orderService;
	@MockBean
	NewsService newsService;
	@MockBean
	MessageService messageService;
	
	@Test
	@WithAnonymousUser
	public void should_redirect_to_login_if_user_do_not_login() throws Exception
	{
		mockMvc.perform(get("/admin/users"))
			   .andExpect(status().is3xxRedirection())
			   .andExpect(redirectedUrl("http://localhost/public/login"));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_forbbiden_if_not_a_admin() throws Exception
	{
		mockMvc.perform(get("/admin/users"))
			   .andExpect(status().is4xxClientError());
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_all_userInfo() throws Exception
	{
		when(userInfoService.findAllUsers()).thenReturn(new ArrayList<UserInfo>());
		MvcResult mvcResult = mockMvc.perform(get("/admin/users"))
								     .andExpect(status().isOk())
								     .andExpect(content().contentType("text/plain;charset=UTF-8"))
								     .andReturn();
		assertEquals(JSON.toJSONString(new ArrayList<UserInfo>()), mvcResult.getResponse().getContentAsString());
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_update_userInfo() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(new UserInfo());
		when(userInfoService.updateUserInfoById(Mockito.any(UserInfo.class))).thenReturn(1);
		mockMvc.perform(post("/admin/users/update/bqx")
						.param("password", "123456")
						.param("email", "1@qq.com")
						.param("telephone", "110"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(userInfoService,times(1)).findUserByUsername("bqx");
		
		ArgumentCaptor<UserInfo> userCaptor = ArgumentCaptor.forClass(UserInfo.class);
		verify(userInfoService,times(1)).updateUserInfoById(userCaptor.capture());
		
		assertNotEquals("123456", userCaptor.getValue().getPassword());
		assertEquals("1@qq.com", userCaptor.getValue().getEmail());
		assertEquals("110", userCaptor.getValue().getTelephone());
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_if_user_not_exist() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(null);
		when(userInfoService.updateUserInfoById(Mockito.any(UserInfo.class))).thenReturn(1);
		mockMvc.perform(post("/admin/users/update/bqx")
						.param("password", "123456")
						.param("email", "1@qq.com")
						.param("telephone", "110"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(userInfoService,times(1)).findUserByUsername("bqx");
		verify(userInfoService,times(0)).updateUserInfoById(Mockito.any(UserInfo.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_when_update_userInfo() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(new UserInfo());
		when(userInfoService.updateUserInfoById(Mockito.any(UserInfo.class))).thenReturn(0);
		mockMvc.perform(post("/admin/users/update/bqx")
						.param("password", "123456")
						.param("email", "1@qq.com")
						.param("telephone", "110"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(userInfoService,times(1)).findUserByUsername("bqx");
		verify(userInfoService,times(1)).updateUserInfoById(Mockito.any(UserInfo.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_delete_a_user() throws Exception
	{
		when(userInfoService.deleteUserByUsername("test")).thenReturn(1);
		mockMvc.perform(delete("/admin/users/delete/test"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(userInfoService,times(1)).deleteUserByUsername("test");
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_if_fail_to_delete_a_user() throws Exception
	{
		when(userInfoService.deleteUserByUsername("test")).thenReturn(0);
		mockMvc.perform(delete("/admin/users/delete/test"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(userInfoService,times(1)).deleteUserByUsername("test");
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_delete_a_site() throws Exception
	{
		when(siteService.deleteSiteById(1)).thenReturn(1);
		mockMvc.perform(delete("/admin/sites/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(siteService,times(1)).deleteSiteById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_if_fail_to_delete_a_site() throws Exception
	{
		when(siteService.deleteSiteById(1)).thenReturn(0);
		mockMvc.perform(delete("/admin/sites/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(siteService,times(1)).deleteSiteById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_add_a_site() throws Exception
	{
		when(siteService.insertSite(Mockito.any(Site.class))).thenReturn(1);
		mockMvc.perform(post("/admin/sites/add")
						.param("name", "test")
						.param("imagePath", "test")
						.param("description", "test")
						.param("location", "test")
						.param("price", "10.0"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		
		ArgumentCaptor<Site> siteCaptor = ArgumentCaptor.forClass(Site.class);
		verify(siteService,times(1)).insertSite(siteCaptor.capture());
		assertEquals("test", siteCaptor.getValue().getName());
		assertEquals("test", siteCaptor.getValue().getDescription());
		assertEquals("test", siteCaptor.getValue().getLocation());
		assertEquals(10.0, siteCaptor.getValue().getPrice());
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_when_fail_to_add_a_site() throws Exception
	{
		when(siteService.insertSite(Mockito.any(Site.class))).thenReturn(0);
		mockMvc.perform(post("/admin/sites/add")
						.param("name", "test")
						.param("imagePath", "test")
						.param("description", "test")
						.param("location", "test")
						.param("price", "10.0"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		
		verify(siteService,times(1)).insertSite(Mockito.any(Site.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_update_a_site() throws Exception
	{
		when(siteService.findSiteById(1)).thenReturn(new Site());
		when(siteService.updateSiteById(Mockito.any(Site.class))).thenReturn(1);
		mockMvc.perform(post("/admin/sites/update/1")
						.param("name", "test")
						.param("imagePath", "test")
						.param("description", "test")
						.param("location", "test")
						.param("price", "10.0"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		
		ArgumentCaptor<Site> siteCaptor = ArgumentCaptor.forClass(Site.class);
		verify(siteService,times(1)).findSiteById(1);
		
		verify(siteService,times(1)).updateSiteById(siteCaptor.capture());
		assertEquals("test", siteCaptor.getValue().getName());
		assertEquals("test", siteCaptor.getValue().getDescription());
		assertEquals("test", siteCaptor.getValue().getLocation());
		assertEquals(10.0, siteCaptor.getValue().getPrice());
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_when_fail_to_update_a_site() throws Exception
	{
		when(siteService.findSiteById(1)).thenReturn(new Site());
		when(siteService.updateSiteById(Mockito.any(Site.class))).thenReturn(0);
		mockMvc.perform(post("/admin/sites/update/1")
						.param("name", "test")
						.param("imagePath", "test")
						.param("description", "test")
						.param("location", "test")
						.param("price", "10.0"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		
		verify(siteService,times(1)).findSiteById(1);
		
		verify(siteService,times(1)).updateSiteById(Mockito.any(Site.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_all_orders() throws Exception
	{
		when(orderService.findAllOrders()).thenReturn(new ArrayList<Order>());
		MvcResult mvcResult = mockMvc.perform(get("/admin/orders"))
								 	 .andExpect(status().isOk())
								 	 .andExpect(content().contentType("text/plain;charset=UTF-8"))
								 	 .andReturn();
		assertEquals("[]", mvcResult.getResponse().getContentAsString());
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_delete_order() throws Exception
	{
		when(orderService.deleteOrderById(1)).thenReturn(1);
		mockMvc.perform(delete("/admin/orders/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(orderService,times(1)).deleteOrderById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_when_fail_to_delete_a_order() throws Exception
	{
		when(orderService.deleteOrderById(1)).thenReturn(0);
		mockMvc.perform(delete("/admin/orders/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(orderService,times(1)).deleteOrderById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_add_news() throws Exception
	{
		when(newsService.insertNews(Mockito.any(News.class))).thenReturn(1);
		mockMvc.perform(post("/admin/news/add")
						.param("title", "test")
						.param("content", "test")
						.param("imagePath", "")
						.param("releaseTime", "2019-11-11 11:11:11"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		
		ArgumentCaptor<News> newsCaptor = ArgumentCaptor.forClass(News.class);
		verify(newsService,times(1)).insertNews(newsCaptor.capture());
		assertEquals("test", newsCaptor.getValue().getTitle());
		assertEquals("test", newsCaptor.getValue().getContent());
		assertEquals("", newsCaptor.getValue().getImagePath());
		assertEquals(Timestamp.valueOf("2019-11-11 11:11:11"), newsCaptor.getValue().getReleaseTime());
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_when_fail_to_add_news() throws Exception
	{
		when(newsService.insertNews(Mockito.any(News.class))).thenReturn(0);
		mockMvc.perform(post("/admin/news/add")
						.param("title", "test")
						.param("content", "test")
						.param("imagePath", "")
						.param("releaseTime", "2019-11-11 11:11:11"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_update_news() throws Exception
	{
		when(newsService.findNewsById(1)).thenReturn(new News());
		when(newsService.updateNewsById(Mockito.any(News.class))).thenReturn(1);
		mockMvc.perform(post("/admin/news/update/1")
						.param("title", "test")
						.param("content", "test")
						.param("imagePath", "")
						.param("releaseTime", "2019-11-11 11:11:11"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(newsService,times(1)).findNewsById(1);
		
		ArgumentCaptor<News> newsCaptor = ArgumentCaptor.forClass(News.class);
		verify(newsService,times(1)).updateNewsById(newsCaptor.capture());
		
		assertEquals("test", newsCaptor.getValue().getTitle());
		assertEquals("test", newsCaptor.getValue().getContent());
		assertEquals("", newsCaptor.getValue().getImagePath());
		assertEquals(Timestamp.valueOf("2019-11-11 11:11:11"), newsCaptor.getValue().getReleaseTime());
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_when_fail_to_update_news() throws Exception
	{
		when(newsService.findNewsById(1)).thenReturn(new News());
		when(newsService.updateNewsById(Mockito.any(News.class))).thenReturn(0);
		mockMvc.perform(post("/admin/news/update/1")
						.param("title", "test")
						.param("content", "test")
						.param("imagePath", "")
						.param("releaseTime", "2019-11-11 11:11:11"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		
		verify(newsService,times(1)).findNewsById(1);
		verify(newsService,times(1)).updateNewsById(Mockito.any(News.class));
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_success_when_delete_news() throws Exception
	{
		when(newsService.deleteNewsById(1)).thenReturn(1);
		mockMvc.perform(delete("/admin/news/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(newsService,times(1)).deleteNewsById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_when_fail_to_delete_news() throws Exception
	{
		when(newsService.deleteNewsById(1)).thenReturn(0);
		mockMvc.perform(delete("/admin/news/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(newsService,times(1)).deleteNewsById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
 	public void should_return_success_when_delete_message() throws Exception
 	{
		when(messageService.deleteMessageById(1)).thenReturn(1);
		mockMvc.perform(delete("/admin/messages/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("success"));
		verify(messageService,times(1)).deleteMessageById(1);
 	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_fail_when_fail_to_delete_messages() throws Exception
	{
		when(messageService.deleteMessageById(1)).thenReturn(0);
		mockMvc.perform(delete("/admin/messages/delete/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().string("fail"));
		verify(messageService,times(1)).deleteMessageById(1);
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_required_html() throws Exception
	{
		mockMvc.perform(get("/admin/user_info.html"))
			   .andExpect(status().isOk())
			   .andExpect(content().contentType("text/html;charset=UTF-8"));
	}
	
}
