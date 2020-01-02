package com.tcg.entity;

import java.sql.Timestamp;

/**
 * 
 * @author tcg
 *
 */

public class Message
{
	private int messageid;
	private int parentId;
	private int userId;
	private String content;
	private Timestamp time;
	
	public int getMessageid()
	{
		return messageid;
	}
	public void setMessageid(int messageid)
	{
		this.messageid = messageid;
	}
	public int getParentId()
	{
		return parentId;
	}
	public void setParentId(int parentId)
	{
		this.parentId = parentId;
	}
	public int getUserId()
	{
		return userId;
	}
	public void setUserId(int userId)
	{
		this.userId = userId;
	}
	public String getContent()
	{
		return content;
	}
	public void setContent(String content)
	{
		this.content = content;
	}
	public Timestamp getTime()
	{
		return time;
	}
	public void setTime(Timestamp time)
	{
		this.time = time;
	}
	
}
