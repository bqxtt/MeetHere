package com.tcg.controller;

import static org.hamcrest.CoreMatchers.nullValue;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.tcg.entity.UserInfo;
import com.tcg.service.UserInfoService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author tcg
 *
 */


@RestController
@Api(tags = "系统接口")
public class SystemController
{
	@Autowired
	UserInfoService userInfoService;
	
	@GetMapping("/system/userId")
	@ApiOperation(value = "获取当前登录用户ID",notes = "未登录返回0")
	public int userId()
	{
		 Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		 String username = auth.getName();
		 boolean isLogin = !(auth instanceof AnonymousAuthenticationToken);

		 UserInfo userInfo = userInfoService.findUserByUsername(username);
		 if(!isLogin)
		 {
			 return 0;
		 }
		 else 
		 {
			 return userInfo.getUserId();
		 }
	}
	
	@GetMapping("/system/username")
	@ApiOperation(value = "获取当前登录用户名",notes = "未登录返回空串")
	public String userName()
	{
		 Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		 String username = auth.getName();
		 boolean isLogin = !(auth instanceof AnonymousAuthenticationToken);
		 
		 if(!isLogin)
		 {
			 return "";
		 }
		 else
		 {
			 return username;
		 }
	}
	
	@GetMapping("/system/authentication")
	@ApiOperation(value = "获取当前登录用户权限",notes = "未登录返回0,普通用户返回1，管理员返回2")
	public int userAuthentication()
	{
		 Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		 boolean isLogin = !(auth instanceof AnonymousAuthenticationToken);
		 
		 if(!isLogin)
		 {
			 return 0;
		 }
		 else 
		 {
			 Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
			 String role = authorities.iterator().next().toString();
			 String roleName = "ROLE_ADMIN";
			 if(roleName.equals(role))
			 {
				 return 2;
			 }
			 else 
			 {
				 return 1;
			 }
		 }
	}
	@GetMapping("/system/getusernamebyid/{userId}")
	@ApiOperation(value = "通过Id获取用户名")
	public String getUsername(@PathVariable("userId") int userId)
	{
		UserInfo userInfo = userInfoService.findUserById(userId);
		return userInfo.getUsername();
	}
}
