package com.tcg.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.internal.matchers.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import com.tcg.entity.Order;
import com.tcg.mapper.OrderMapper;
import com.tcg.service.OrderService;

@RunWith(SpringRunner.class)
@SpringBootTest
class OrderServiceImplTest
{
	@Autowired
	OrderService orderService;
	
	@MockBean
	OrderMapper orderMapper;
	
	private Order order;
	
	@Test
	public void should_insert_a_order_by_mapper()
	{
		order = new Order();
		when(orderMapper.insertOrder(Mockito.any(Order.class))).thenReturn(1);
		
		int t = orderService.insertOrder(order);
		verify(orderMapper).insertOrder(Mockito.any(Order.class));
		assertEquals(1, t);
	}
	
	@Test
	public void should_update_order_by_mapper()
	{
		order = new Order();
		when(orderMapper.updateOrderById(Mockito.any(Order.class))).thenReturn(1);
		
		int t = orderService.updateOrderById(order);
		verify(orderMapper).updateOrderById(Mockito.any(Order.class));
		assertEquals(1, t);
	}
	
	@Test
	public void should_delete_order_by_mapper()
	{
		when(orderMapper.deleteOrderById(Mockito.anyInt())).thenReturn(1);
		
		int t = orderService.deleteOrderById(1);
		verify(orderMapper).deleteOrderById(Mockito.anyInt());
		assertEquals(1, t);
	}
	
	@Test
	public void should_find_orders_by_mapper()
	{
		when(orderMapper.findAllOrders()).thenReturn(new ArrayList<Order>());
		when(orderMapper.findOrderBySiteId(Mockito.anyInt())).thenReturn(new ArrayList<Order>());
		when(orderMapper.findOrderByUserId(Mockito.anyInt())).thenReturn(new ArrayList<Order>());
		when(orderMapper.findOrderByStartTimeAndEndTime(Mockito.any(Timestamp.class))).thenReturn(new ArrayList<Order>());
		when(orderMapper.findOrderById(Mockito.anyInt())).thenReturn(new Order());
		
		orderService.findAllOrders();
		orderService.findOrderBySiteId(1);
		orderService.findOrderByUserId(1);
		orderService.findOrderByStartTimeAndEndTime(new Timestamp(1));
		orderService.findOrderById(1);
		
		verify(orderMapper).findAllOrders();
		verify(orderMapper).findOrderBySiteId(Mockito.anyInt());
		verify(orderMapper).findOrderByUserId(Mockito.anyInt());
		verify(orderMapper).findOrderByStartTimeAndEndTime(Mockito.any(Timestamp.class));
		verify(orderMapper).findOrderById(Mockito.anyInt());
	}

}
