package com.tcg.service;

import java.util.List;

import com.tcg.entity.UserInfo;

/**
 * 
 * @author tcg
 *
 */

public interface UserInfoService
{
	/**
	 * insertUser
	 * @param userInfo
	 * @return int
	 */
	public int insertUser(UserInfo userInfo);

	/**
	 * updateUserInfoById
	 * @param userInfo
	 * @return int
	 */
	public int updateUserInfoById(UserInfo userInfo);

	/**
	 * findUserById
	 * @param id
	 * @return UserInfo
	 */
	public UserInfo findUserById(int id);

	/**
	 * findUserByUsername
	 * @param username
	 * @return UserInfo
	 */
	public UserInfo findUserByUsername(String username);

	/**
	 * findAllUsers
	 * @return List<UserInfo>
	 */
	public List<UserInfo> findAllUsers();

	/**
	 * deleteUserById
	 * @param id
	 * @return int
	 */
	public int deleteUserById(int id);

	/**
	 * deleteUserByUsername
	 * @param username
	 * @return int
	 */
	public int deleteUserByUsername(String username);
}
