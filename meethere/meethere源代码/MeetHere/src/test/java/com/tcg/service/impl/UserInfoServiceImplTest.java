package com.tcg.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import com.tcg.entity.UserInfo;
import com.tcg.mapper.UserInfoMapper;
import com.tcg.service.UserInfoService;

@RunWith(SpringRunner.class)
@SpringBootTest
class UserInfoServiceImplTest
{
	@Autowired
	UserInfoService userInfoService;
	
	@MockBean
	UserInfoMapper userInfoMapper;
	
	private UserInfo userInfo;

	@Test
	public void should_insert_a_user_by_mapper()
	{
		userInfo = new UserInfo();
		userInfo.setPassword("456");
		
		when(userInfoMapper.insertUser(Mockito.any(UserInfo.class))).thenReturn(1);
		
		int t = userInfoService.insertUser(userInfo);
		
		verify(userInfoMapper).insertUser(Mockito.any(UserInfo.class));
		assertEquals(1, t);
	}
	
	@Test
	public void should_update_userInfo_by_mapper()
	{
		userInfo = new UserInfo();
		
		when(userInfoMapper.updateUserInfoById(Mockito.any(UserInfo.class))).thenReturn(1);
		
		int t = userInfoService.updateUserInfoById(userInfo);
		
		verify(userInfoMapper).updateUserInfoById(Mockito.any(UserInfo.class));
		assertEquals(1, t);
	}

	@Test
	public void should_delete_user_by_mapper()
	{
		userInfo = new UserInfo();
		
		when(userInfoMapper.deleteUserById(Mockito.anyInt())).thenReturn(1);
		
		int t = userInfoService.deleteUserById(1);
		verify(userInfoMapper).deleteUserById(Mockito.anyInt());
		assertEquals(1, t);
		
		when(userInfoMapper.deleteUserByUsername(Mockito.anyString())).thenReturn(1);
		
		t = userInfoService.deleteUserByUsername(new String());
		verify(userInfoMapper).deleteUserByUsername(Mockito.anyString());
		assertEquals(1, t);
	}
	
	@Test
	public void should_find_all_users_by_mapper()
	{
		List<UserInfo> userInfos = new ArrayList<UserInfo>();
		
		when(userInfoMapper.findAllUsers()).thenReturn(userInfos);
		
		userInfoService.findAllUsers();
		verify(userInfoMapper).findAllUsers();
	}
	
	@Test
	public void should_find_user_by_mapper()
	{
		when(userInfoMapper.findUserById(Mockito.anyInt())).thenReturn(new UserInfo());
		when(userInfoMapper.findUserByUsername(Mockito.anyString())).thenReturn(new UserInfo());
		
		userInfoService.findUserById(1);
		userInfoService.findUserByUsername(new String());
		
		verify(userInfoMapper).findUserById(Mockito.anyInt());
		verify(userInfoMapper).findUserByUsername(Mockito.anyString());
	}
}
