package com.tcg.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.tcg.entity.UserInfo;
import com.tcg.mapper.UserInfoMapper;
import com.tcg.service.UserInfoService;

/**
 * 
 * @author tcg
 *
 */

@Service
public class UserInfoServiceImpl implements UserInfoService
{
	static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();
	
	@Autowired
	UserInfoMapper userInfoMapper;

	@Override
	public int insertUser(UserInfo userInfo)
	{
		return userInfoMapper.insertUser(userInfo);
	}

	@Override
	public int updateUserInfoById(UserInfo userInfo)
	{
		return userInfoMapper.updateUserInfoById(userInfo);
	}

	@Override
	public UserInfo findUserById(int id)
	{
		return userInfoMapper.findUserById(id);
	}

	@Override
	public UserInfo findUserByUsername(String username)
	{
		return userInfoMapper.findUserByUsername(username);
	}

	@Override
	public List<UserInfo> findAllUsers()
	{
		return userInfoMapper.findAllUsers();
	}

	@Override
	public int deleteUserById(int id)
	{
		return userInfoMapper.deleteUserById(id);
	}

	@Override
	public int deleteUserByUsername(String username)
	{
		return userInfoMapper.deleteUserByUsername(username);
	}

}
