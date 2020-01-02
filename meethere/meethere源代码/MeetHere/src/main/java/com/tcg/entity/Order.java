package com.tcg.entity;

import java.sql.Timestamp;

/**
 * 
 * @author tcg
 *
 */

public class Order
{
	private int orderId;
	private int userId;
	private int siteId;
	private Timestamp startTime;
	private Timestamp endTime;
	private short state;
	
	public int getOrderId()
	{
		return orderId;
	}
	public void setOrderId(int orderId)
	{
		this.orderId = orderId;
	}
	public int getUserId()
	{
		return userId;
	}
	public void setUserId(int userId)
	{
		this.userId = userId;
	}

	public int getSiteId()
	{
		return siteId;
	}
	public void setSiteId(int siteId)
	{
		this.siteId = siteId;
	}
	public Timestamp getStartTime()
	{
		return startTime;
	}
	public void setStartTime(Timestamp startTime)
	{
		this.startTime = startTime;
	}
	public Timestamp getEndTime()
	{
		return endTime;
	}
	public void setEndTime(Timestamp endTime)
	{
		this.endTime = endTime;
	}
	public short getState()
	{
		return state;
	}
	public void setState(short state)
	{
		this.state = state;
	}
	
}
