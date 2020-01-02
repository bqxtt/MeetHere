package com.tcg.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.util.MultiValueMap;

import com.alibaba.fastjson.JSON;
import com.tcg.entity.Message;
import com.tcg.entity.News;
import com.tcg.entity.Site;
import com.tcg.entity.UserInfo;
import com.tcg.service.MessageService;
import com.tcg.service.NewsService;
import com.tcg.service.SiteService;
import com.tcg.service.UserInfoService;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = PublicController.class)
class PublicControllerTest
{
	@Autowired
	MockMvc mockMvc;
	@MockBean
	NewsService newsService;
	@MockBean
	MessageService messageService; 
	@MockBean
	SiteService siteService;
	@MockBean
	UserInfoService userInfoService;
	
	
	@Test
	@WithAnonymousUser
	public void should_return_all_news() throws Exception
	{
		String fileExist = "src/test/resources/images/1.txt";
		String fileNotExist = "src/test/resources/images/2.txt";
		File file = new File(fileExist);
		file.createNewFile();
		
		List<News> news = new ArrayList<News>();
		
		News news1 = new News();
		news1.setImagePath(null);
		
		News news2 = new News();
		news2.setImagePath("");
		
		News news3 = new News();
		news3.setImagePath(fileExist);
		
		News news4 = new News();
		news4.setImagePath(fileNotExist);
		
		news.add(news4);
		news.add(news3);
		news.add(news2);
		news.add(news1);
		
		when(newsService.findAllNews()).thenReturn(news);
		MvcResult mvcResult = mockMvc.perform(get("/public/news"))
									 .andExpect(status().isOk())
									 .andReturn();
		assertEquals(JSON.toJSONString(news), mvcResult.getResponse().getContentAsString());
		verify(newsService,times(1)).findAllNews();
		
		file.delete();
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_news_content_html() throws Exception
	{
		String fileExist = "src/test/resources/images/1.txt";
		String fileNotExist = "src/test/resources/images/2.txt";
		File file = new File(fileExist);
		file.createNewFile();
		
		News news = new News();
		news.setImagePath(fileExist);
		
		when(newsService.findNewsById(1)).thenReturn(news);
		mockMvc.perform(get("/public/news/1"))
			   .andExpect(status().isOk())
			   .andExpect(content().contentType("text/html;charset=UTF-8"));
		
		news.setImagePath(fileNotExist);
		mockMvc.perform(get("/public/news/1"))
		   .andExpect(status().isOk())
		   .andExpect(content().contentType("text/html;charset=UTF-8"));
		
		news.setImagePath(null);
		mockMvc.perform(get("/public/news/1"))
		   .andExpect(status().isOk())
		   .andExpect(content().contentType("text/html;charset=UTF-8"));
		
		news.setImagePath("");
		mockMvc.perform(get("/public/news/1"))
		   .andExpect(status().isOk())
		   .andExpect(content().contentType("text/html;charset=UTF-8"));
		verify(newsService,times(4)).findNewsById(1);
		
		file.delete();
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_all_root_messages() throws Exception
	{
		when(messageService.findMessagesByParentId(0)).thenReturn(new ArrayList<Message>());
		MvcResult mvcResult = mockMvc.perform(get("/public/messages"))
									 .andExpect(status().isOk())
									 .andReturn();
		assertEquals("[]", mvcResult.getResponse().getContentAsString());
		verify(messageService,times(1)).findMessagesByParentId(0);
	}
	
	@Test
	@WithAnonymousUser
	public void sholud_return_messages_reply_to_1() throws Exception
	{
		when(messageService.findMessagesByParentId(1)).thenReturn(new ArrayList<Message>());
		MvcResult mvcResult = mockMvc.perform(get("/public/messages/1"))
									 .andExpect(status().isOk())
									 .andReturn();
		assertEquals("[]", mvcResult.getResponse().getContentAsString());
		verify(messageService,times(1)).findMessagesByParentId(1);
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_all_sites() throws Exception
	{
		String fileExist = "src/test/resources/images/1.txt";
		String fileNotExist = "src/test/resources/images/2.txt";
		File file = new File(fileExist);
		file.createNewFile();
		
		List<Site> sites = new ArrayList<Site>();
		
		Site site1 = new Site();
		site1.setImagePath(null);
		
		Site site2 = new Site();
		site2.setImagePath("");
		
		Site site3 = new Site();
		site3.setImagePath(fileExist);
		
		Site site4 = new Site();
		site4.setImagePath(fileNotExist);
		
		sites.add(site4);
		sites.add(site3);
		sites.add(site2);
		sites.add(site1);
		
		when(siteService.findAllSites()).thenReturn(sites);
		MvcResult mvcResult = mockMvc.perform(get("/public/sites"))
									 .andExpect(status().isOk())
									 .andReturn();
		assertEquals(JSON.toJSONString(sites), mvcResult.getResponse().getContentAsString());
		verify(siteService,times(1)).findAllSites();
		
		file.delete();
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_login_html() throws Exception
	{
		mockMvc.perform(get("/public/login"))
			   .andExpect(status().isOk())
			   .andExpect(content().contentType("text/html;charset=UTF-8"));
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_register_html() throws Exception
	{
		mockMvc.perform(get("/public/reg"))
		   	   .andExpect(status().isOk())
		       .andExpect(content().contentType("text/html;charset=UTF-8"));
	}
	
	@Test
	@WithAnonymousUser
	public void should_create_a_new_user() throws Exception
	{	
		when(userInfoService.insertUser(Mockito.any(UserInfo.class))).thenReturn(1);
		MvcResult mvcResult = mockMvc.perform(post("/public/register")
											  .param("username", "test")
											  .param("password", "123456")
											  .param("email", "1@qq.com")
											  .param("telephone", "110"))
							         .andExpect(status().isOk())
							         .andReturn();
		assertEquals("success", mvcResult.getResponse().getContentAsString());
		
		ArgumentCaptor<UserInfo> userCaptor = ArgumentCaptor.forClass(UserInfo.class);
		verify(userInfoService,times(1)).insertUser(userCaptor.capture());
		
		assertEquals("test", userCaptor.getValue().getUsername());
		assertNotEquals("123456", userCaptor.getValue().getPassword());
		assertEquals("1@qq.com", userCaptor.getValue().getEmail());
		assertEquals("110", userCaptor.getValue().getTelephone());
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_fail_when_create_a_user_fail() throws Exception
	{
		when(userInfoService.insertUser(Mockito.any(UserInfo.class))).thenReturn(0);
		MvcResult mvcResult = mockMvc.perform(post("/public/register")
											  .param("username", "test")
											  .param("password", "123456")
											  .param("email", "1@qq.com")
											  .param("telephone", "110"))
							         .andExpect(status().isOk())
							         .andReturn();
		assertEquals("fail", mvcResult.getResponse().getContentAsString());
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_index_html() throws Exception
	{
		mockMvc.perform(get("/public/"))
	   	   .andExpect(status().isOk())
	       .andExpect(content().contentType("text/html;charset=UTF-8"));
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_required_html() throws Exception
	{
		mockMvc.perform(get("/public/message.html"))
			   .andExpect(status().isOk())
			   .andExpect(content().contentType("text/html;charset=UTF-8"));		
	}
}
