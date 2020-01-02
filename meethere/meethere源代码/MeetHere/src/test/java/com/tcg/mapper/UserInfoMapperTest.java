package com.tcg.mapper;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import com.tcg.entity.UserInfo;

@Transactional
@RunWith(SpringRunner.class)
@SpringBootTest
class UserInfoMapperTest
{
	@Autowired
	UserInfoMapper userInfoMapper;
	
	@Test
	public void should_insert_a_user()
	{
		UserInfo user = new UserInfo();
		
		user.setUsername("test");
		user.setPassword("123");
		user.setRoles("ROLE_ADMIN");
		
		int t = userInfoMapper.insertUser(user);
		assertEquals(1, t);
	}
	
	@Test
	public void should_update_password_by_id()
	{
		UserInfo user = new UserInfo();
		
		user.setUsername("test");
		user.setPassword("123");
		user.setRoles("ROLE_ADMIN");
		
		userInfoMapper.insertUser(user);
		
		user = userInfoMapper.findUserByUsername("test");
		assertNotNull(user);
		
		user.setPassword("456");
		userInfoMapper.updateUserInfoById(user);
		
		user = userInfoMapper.findUserByUsername("test");
		assertNotNull(user);
		
		assertEquals("456", user.getPassword());
	}

	@Test
	public void should_delete_user_by_username()
	{
		UserInfo user = new UserInfo();
		
		user.setUsername("test");
		user.setPassword("123");
		user.setRoles("ROLE_ADMIN");
		
		userInfoMapper.insertUser(user);
		
		user = userInfoMapper.findUserByUsername("test");
		assertNotNull(user);
		
		int t = userInfoMapper.deleteUserByUsername("test");
		assertEquals(1, t);
		
		user = userInfoMapper.findUserByUsername("test");
		assertNull(user);
	}
	
	@Test
	public void should_find_all_users()
	{
		UserInfo user = new UserInfo();
		
		user.setUsername("test");
		user.setPassword("123");
		user.setRoles("ROLE_ADMIN");
		
		userInfoMapper.insertUser(user);
		
		List<UserInfo> users = userInfoMapper.findAllUsers();
		assertNotNull(users);
	}
}
