package com.tcg.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.tcg.entity.UserInfo;

/**
 * 
 * @author tcg
 *
 */

@Mapper
public interface UserInfoMapper
{
	/**
	 * insertUser
	 * @param userInfo
	 * @return int
	 */
	@Insert("insert into userInfo(username,password,roles,email,telephone)\n"
			+ "values(#{username},#{password},#{roles},#{email},#{telephone})")
	public int insertUser(UserInfo userInfo);

	/**
	 * updateUserInfoById
	 * @param userInfo
	 * @return int
	 */
	@Update("update userInfo set password = #{password},email = #{email},telephone = #{telephone}\n"
			+ "where userId = #{userId}")
	public int updateUserInfoById(UserInfo userInfo);

	/**
	 * findUserById
	 * @param id
	 * @return UserInfo
	 */
	@Select("select * from userInfo where userId = #{id}")
	public UserInfo findUserById(@Param("id") int id);
	
	/**
	 * findUserByUsername
	 * @param username
	 * @return UserInfo
	 */
	@Select("select * from userInfo where username = #{username}")
	public UserInfo findUserByUsername(@Param("username") String username);

	/**
	 * findAllUsers
	 * @return List<UserInfo>
	 */
	@Select("select * from userInfo")
	public List<UserInfo> findAllUsers();
	
	/**
	 * deleteUserById
	 * @param id
	 * @return int
	 */
	@Delete("delete from userInfo where userId = #{id}")
	public int deleteUserById(@Param("id") int id);

	/**
	 * deleteUserByUsername
	 * @param username
	 * @return int
	 */
	@Delete("delete from userInfo where username = #{username}")
	public int deleteUserByUsername(@Param("username") String username);
}
