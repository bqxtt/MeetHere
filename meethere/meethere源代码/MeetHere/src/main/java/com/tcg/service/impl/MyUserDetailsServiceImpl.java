package com.tcg.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tcg.entity.UserInfo;
import com.tcg.service.UserInfoService;

/**
 * 
 * @author tcg
 *
 */

@Service
public class MyUserDetailsServiceImpl implements UserDetailsService
{
	@Autowired
	UserInfoService userInfoService;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
	{
		UserInfo userInfo = userInfoService.findUserByUsername(username);
		if(userInfo == null)
		{
			throw new UsernameNotFoundException("No such user!");
		}
		
        List<GrantedAuthority> authorities = new ArrayList<>();
        String roles = userInfo.getRoles();
        authorities.add(new SimpleGrantedAuthority(roles));
		
		return new User(username, userInfo.getPassword(), authorities);
	}

}
