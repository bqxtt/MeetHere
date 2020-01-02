package com.tcg.service;

import java.util.List;

import com.tcg.entity.Message;

/**
 * 
 * @author tcg
 *
 */

public interface MessageService
{
	/**
	 * insertMessage
	 * @param message
	 * @return int
	 */
	public int insertMessage(Message message);

	/**
	 * findMessagesByParentId
	 * @param parentId
	 * @return List<Message>
	 */
	public List<Message> findMessagesByParentId(int parentId);

	/**
	 * findMessagesByUserId
	 * @param userId
	 * @return List<Message>
	 */
	public List<Message> findMessagesByUserId(int userId);

	/**
	 * findMessageById
	 * @param id
	 * @return Message
	 */
	public Message findMessageById(int id);

	/**
	 * findAllMessages
	 * @return List<Message>
	 */
	public List<Message> findAllMessages();

	/**
	 * deleteMessageById
	 * @param id
	 * @return int
	 */
	public int deleteMessageById(int id);

	/**
	 * deleteMessageByParentId
	 * @param parentId
	 * @return int
	 */
	public int deleteMessageByParentId(int parentId);

	/**
	 * deleteMessageByUserId
	 * @param userId
	 * @return int
	 */
	public int deleteMessageByUserId(int userId);
}
