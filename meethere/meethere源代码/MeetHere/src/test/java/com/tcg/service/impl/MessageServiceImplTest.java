package com.tcg.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import com.tcg.entity.Message;
import com.tcg.mapper.MessageMapper;
import com.tcg.service.MessageService;

@RunWith(SpringRunner.class)
@SpringBootTest
class MessageServiceImplTest
{
	@Autowired
	MessageService messageService;
	
	@MockBean
	MessageMapper messageMapper;
	
	private Message message;

	@Test
	public void should_insert_a_message_by_mapper()
	{
		message = new Message();
		when(messageMapper.insertMessage(Mockito.any(Message.class))).thenReturn(1);
		
		int t = messageService.insertMessage(message);
		verify(messageMapper).insertMessage(Mockito.any(Message.class));
		assertEquals(1, t);
	}

	@Test
	public void should_find_messages_by_mapper()
	{
		when(messageMapper.findAllMessages()).thenReturn(new ArrayList<Message>());
		when(messageMapper.findMessageById(Mockito.anyInt())).thenReturn(new Message());
		when(messageMapper.findMessagesByParentId(Mockito.anyInt())).thenReturn(new ArrayList<Message>());
		when(messageMapper.findMessagesByUserId(Mockito.anyInt())).thenReturn(new ArrayList<Message>());
		
		messageService.findAllMessages();
		messageService.findMessageById(1);
		messageService.findMessagesByParentId(1);
		messageService.findMessagesByUserId(1);
		
		verify(messageMapper).findAllMessages();
		verify(messageMapper).findMessageById(Mockito.anyInt());
		verify(messageMapper).findMessagesByParentId(Mockito.anyInt());
		verify(messageMapper).findMessagesByUserId(Mockito.anyInt());		
	}
	
	
	@Test
	public void shoud_delete_messages_by_parentId()
	{
		when(messageMapper.deleteMessageById(Mockito.anyInt())).thenReturn(1);
		when(messageMapper.deleteMessageByParentId(Mockito.anyInt())).thenReturn(1);
		when(messageMapper.deleteMessageByUserId(Mockito.anyInt())).thenReturn(1);
		
		int t1 = messageService.deleteMessageById(1);
		int t2 = messageService.deleteMessageByParentId(1);
		int t3 = messageService.deleteMessageByUserId(1);
		
		verify(messageMapper).deleteMessageById(Mockito.anyInt());
		verify(messageMapper).deleteMessageByParentId(Mockito.anyInt());
		verify(messageMapper).deleteMessageByUserId(Mockito.anyInt());
		
		assertEquals(1, t1);
		assertEquals(1, t2);
		assertEquals(1, t3);
	}
	
}
