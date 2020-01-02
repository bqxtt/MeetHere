package com.tcg.mapper;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.function.IntToDoubleFunction;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import com.tcg.entity.Message;

@Transactional
@RunWith(SpringRunner.class)
@SpringBootTest
class MessageMapperTest
{
	@Autowired
	MessageMapper messageMapper;
	
	@Test
	public void should_insert_a_message()
	{
		Message message = new Message();
		message.setUserId(7);
		message.setContent("testContent");
		message.setTime(Timestamp.valueOf("2019-05-07 00:00:00"));
		
		int t = messageMapper.insertMessage(message);
		assertEquals(1, t);
	}

	@Test
	public void should_find_messages_by_parentId()
	{
		Message message = new Message();
		message.setUserId(7);
		message.setParentId(1);
		message.setContent("testContent");
		message.setTime(Timestamp.valueOf("2019-05-07 00:00:00"));
		messageMapper.insertMessage(message);
		
		List<Message> messages = messageMapper.findMessagesByParentId(1);
		assertNotNull(messages);
		assertEquals(1, messages.size());
	}
	
	@Test
	public void should_find_messages_by_userId()
	{
		Message message = new Message();
		message.setUserId(7);
		message.setParentId(1);
		message.setContent("testContent");
		message.setTime(Timestamp.valueOf("2019-05-07 00:00:00"));
		messageMapper.insertMessage(message);
		
		List<Message> messages = messageMapper.findMessagesByUserId(7);
		assertNotNull(messages);
		assertTrue(1 <= messages.size());
	}
	
	@Test
	public void shoud_delete_messages_by_parentId()
	{
		Message message = new Message();
		message.setUserId(7);
		message.setParentId(1);
		message.setContent("testContent");
		message.setTime(Timestamp.valueOf("2019-05-07 00:00:00"));
		messageMapper.insertMessage(message);
		
		int t = messageMapper.deleteMessageByParentId(1);
		assertEquals(1, t);
		
		List<Message> messages = messageMapper.findMessagesByParentId(1);
		assertNotNull(messages);
		assertEquals(0, messages.size());
	}
	
	@Test
	public void should_delete_messages_by_userId()
	{
		Message message = new Message();
		message.setUserId(7);
		message.setParentId(1);
		message.setContent("testContent");
		message.setTime(Timestamp.valueOf("2019-05-07 00:00:00"));
		messageMapper.insertMessage(message);
		
		int t = messageMapper.deleteMessageByUserId(7);
		assertTrue(t >= 1);
		
		List<Message> messages = messageMapper.findMessagesByUserId(7);
		assertNotNull(messages);
		assertEquals(0, messages.size());
	}
}
