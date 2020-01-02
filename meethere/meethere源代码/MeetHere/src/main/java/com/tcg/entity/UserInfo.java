package com.tcg.entity;

/**
 * 
 * @author tcg
 *
 */

public class UserInfo
{
	private int userId;
	private String username;
	private String password;
	private String roles;
	private String email;
	private String telephone;

	public int getUserId()
	{
		return userId;
	}
	public void setUserId(int userId)
	{
		this.userId = userId;
	}
	public String getUsername()
	{
		return username;
	}
	public void setUsername(String username)
	{
		this.username = username;
	}
	public String getPassword()
	{
		return password;
	}
	public void setPassword(String password)
	{
		this.password = password;
	}
	public String getRoles()
	{
		return roles;
	}
	public void setRoles(String roles)
	{
		this.roles = roles;
	}
	public String getEmail()
	{
		return email;
	}
	public void setEmail(String email)
	{
		this.email = email;
	}
	public String getTelephone()
	{
		return telephone;
	}
	public void setTelephone(String telephone)
	{
		this.telephone = telephone;
	}
	
}
