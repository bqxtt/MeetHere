package com.tcg.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcg.entity.Order;
import com.tcg.mapper.OrderMapper;
import com.tcg.service.OrderService;

/**
 * 
 * @author tcg
 *
 */

@Service
public class OrderServiceImpl implements OrderService
{
	@Autowired
	OrderMapper orderMapper;
	
	@Override
	public int insertOrder(Order order)
	{
		return orderMapper.insertOrder(order);
	}

	@Override
	public int updateOrderById(Order order)
	{
		return orderMapper.updateOrderById(order);
	}

	@Override
	public List<Order> findOrderByUserId(int userId)
	{
		return orderMapper.findOrderByUserId(userId);
	}

	@Override
	public List<Order> findOrderBySiteId(int siteId)
	{
		return orderMapper.findOrderBySiteId(siteId);
	}

	@Override
	public List<Order> findAllOrders()
	{
		return orderMapper.findAllOrders();
	}

	@Override
	public List<Order> findOrderByStartTimeAndEndTime(Timestamp time)
	{
		return orderMapper.findOrderByStartTimeAndEndTime(time);
	}

	@Override
	public int deleteOrderById(int id)
	{
		return orderMapper.deleteOrderById(id);
	}

	@Override
	public Order findOrderById(int orderId)
	{
		return orderMapper.findOrderById(orderId);
	}

}
