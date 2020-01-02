package com.tcg.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.authenticated;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.unauthenticated;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.PasswordAuthentication;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.tcg.entity.UserInfo;
import com.tcg.service.UserInfoService;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = SystemController.class)
class SystemControllerTest
{
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private UserInfoService userInfoService;

	private static UserInfo userInfo;
	
	@BeforeAll
	public static void init()
	{
		userInfo = new UserInfo();
		userInfo.setUserId(1);
		userInfo.setUsername("bqx");
		userInfo.setPassword("$2a$10$huqdnccSpjJQRmLH3ZOUIePAF/rNg8ryybuFGntOoZFlKqWfiplVC");
		userInfo.setRoles("ROLE_ADMIN");
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_0_of_userId_when_no_user_login() throws Exception
	{
		MvcResult mvcResult = mockMvc.perform(get("/system/userId"))
									 .andExpect(status().isOk())
									 .andReturn();
		assertEquals("0", mvcResult.getResponse().getContentAsString());
	}
	
	@Test
	@WithMockUser(username="bqx",roles={"ADMIN"})
	public void should_return_userId_when_user_login() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(userInfo);
		MvcResult mvcResult = mockMvc.perform(get("/system/userId"))
									 .andExpect(status().isOk())
									 .andReturn();
		assertEquals("1", mvcResult.getResponse().getContentAsString());
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_null_when_no_user_login() throws Exception
	{
		MvcResult mvcResult = mockMvc.perform(get("/system/username"))
									 .andExpect(status().isOk())
									 .andReturn();		
		assertEquals("", mvcResult.getResponse().getContentAsString());
	}
	
	@Test
	@WithMockUser(username = "username",roles = {"ADMIN"})
	public void should_return_username_when_user_login() throws Exception
	{
		MvcResult mvcResult = mockMvc.perform(get("/system/username"))
									 .andExpect(status().isOk())
									 .andReturn();	
		assertEquals("username", mvcResult.getResponse().getContentAsString());
	}
	
	@Test
	@WithAnonymousUser
	public void should_return_0_when_no_user_login() throws Exception
	{
		MvcResult mvcResult = mockMvc.perform(get("/system/authentication"))
									 .andExpect(status().isOk())
									 .andReturn();	
		assertEquals("0", mvcResult.getResponse().getContentAsString());		
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"USER"})
	public void should_return_1_when_user_login() throws Exception
	{
		MvcResult mvcResult = mockMvc.perform(get("/system/authentication"))
									 .andExpect(status().isOk())
									 .andReturn();	
		assertEquals("1", mvcResult.getResponse().getContentAsString());	
	}
	
	@Test
	@WithMockUser(username = "bqx",roles = {"ADMIN"})
	public void should_return_2_when_admin_login() throws Exception
	{
		MvcResult mvcResult = mockMvc.perform(get("/system/authentication"))
									 .andExpect(status().isOk())
									 .andReturn();	
		assertEquals("2", mvcResult.getResponse().getContentAsString());	
	}
	
	@Test
	public void should_login_success_when_user_is_correct() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(userInfo);
		mockMvc.perform(formLogin("/public/login").user("bqx").password("123456"))
			   .andExpect(authenticated());
	}
	
	@Test
	public void should_login_fail_when_password_is_not_correct() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(userInfo);
		mockMvc.perform(formLogin("/public/login").user("bqx").password("invaild"))
			   .andExpect(unauthenticated());
	}
	
	@Test
	public void should_login_fail_when_user_is_not_exist() throws Exception
	{
		when(userInfoService.findUserByUsername("bqx")).thenReturn(null);
		mockMvc.perform(formLogin("/public/login").user("bqx").password("123456"))
		   	   .andExpect(unauthenticated());
	}
}
