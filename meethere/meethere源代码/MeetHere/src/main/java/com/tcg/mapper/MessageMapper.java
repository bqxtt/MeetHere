package com.tcg.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.tcg.entity.Message;

/**
 * 
 * @author tcg
 *
 */

@Mapper
public interface MessageMapper
{
	/**
	 * insertMessage
	 * 
	 * @param message
	 * @return int
	 */
	@Insert("insert into messages(parentId,userId,content,time)\n"
			 + "values(#{parentId},#{userId},#{content},#{time})")
	public int insertMessage(Message message);
	
	/**
	 * findMessagesByParentId
	 * 
	 * @param parentId
	 * @return List<Message>
	 */
	@Select("select * from messages where parentId = #{parentId}")
	public List<Message> findMessagesByParentId(@Param("parentId") int parentId);
	
	/**
	 * findMessagesByUserId
	 * 
	 * @param userId
	 * @return List<Message>
	 */
	@Select("select * from messages where userId = #{userId}")
	public List<Message> findMessagesByUserId(@Param("userId") int userId);
	
	/**
	 * findMessageById
	 * 
	 * @param id
	 * @return Message
	 */
	@Select("select * from messages where messageId = #{id}")
	public Message findMessageById(@Param("id") int id);
	
	/**
	 * findAllMessages
	 * 
	 * @return List<Message>
	 */
	@Select("select * from messages")
	public List<Message> findAllMessages();

	
	/**
	 * deleteMessageById
	 * 
	 * @param id
	 * @return int
	 */
	@Delete("delete from messages where messageId = #{id}")
	public int deleteMessageById(@Param("id") int id);
	
	/**
	 * deleteMessageByParentId
	 * 
	 * @param parentId
	 * @return int
	 */
	@Delete("delete from messages where parentId = #{parentId}")
	public int deleteMessageByParentId(@Param("parentId") int parentId);
	
	/**
	 * deleteMessageByUserId
	 * 
	 * @param userId
	 * @return int
	 */
	@Delete("delete from messages where userId = #{userId}")
	public int deleteMessageByUserId(@Param("userId") int userId);
}
