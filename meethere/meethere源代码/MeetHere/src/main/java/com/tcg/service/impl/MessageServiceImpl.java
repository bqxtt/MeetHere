package com.tcg.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcg.entity.Message;
import com.tcg.mapper.MessageMapper;
import com.tcg.service.MessageService;

/**
 * 
 * @author tcg
 *
 */

@Service
public class MessageServiceImpl implements MessageService
{
	@Autowired
	MessageMapper messageMapper;

	@Override
	public int insertMessage(Message message)
	{
		return messageMapper.insertMessage(message);
	}

	@Override
	public List<Message> findMessagesByParentId(int parentId)
	{
		return messageMapper.findMessagesByParentId(parentId);
	}

	@Override
	public List<Message> findMessagesByUserId(int userId)
	{
		return messageMapper.findMessagesByUserId(userId);
	}

	@Override
	public Message findMessageById(int id)
	{
		return messageMapper.findMessageById(id);
	}

	@Override
	public List<Message> findAllMessages()
	{
		return messageMapper.findAllMessages();
	}

	@Override
	public int deleteMessageById(int id)
	{
		return messageMapper.deleteMessageById(id);
	}

	@Override
	public int deleteMessageByParentId(int parentId)
	{
		return messageMapper.deleteMessageByParentId(parentId);
	}

	@Override
	public int deleteMessageByUserId(int userId)
	{
		return messageMapper.deleteMessageByUserId(userId);
	}

}
