package com.tcg.mapper;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import com.tcg.entity.Order;

@Transactional
@RunWith(SpringRunner.class)
@SpringBootTest
class OrderMapperTest
{
	@Autowired
	OrderMapper orderMapper;
	
	@Test
	public void should_insert_a_order()
	{
		Order order = new Order();
		
		order.setSiteId(1);
		order.setUserId(7);
		order.setStartTime(Timestamp.valueOf("2019-12-05 00:00:00"));
		order.setEndTime(Timestamp.valueOf("2019-12-05 01:00:00"));
		order.setState((short)2);
		
		int t = orderMapper.insertOrder(order);
		assertEquals(1, t);
	}
	
	@Test
	public void should_update_order_by_id()
	{
		Order order = new Order();
		
		order.setSiteId(1);
		order.setUserId(7);
		order.setStartTime(Timestamp.valueOf("2019-12-05 00:00:00"));
		order.setEndTime(Timestamp.valueOf("2019-12-05 01:00:00"));
		order.setState((short)2);
		orderMapper.insertOrder(order);
		
		List<Order> orders = orderMapper.findOrderBySiteId(1);
		assertNotNull(orders);
		
		order = orders.get(0);
		Timestamp sTimestamp = Timestamp.valueOf("2019-12-06 00:00:00");
		Timestamp eTimestamp = Timestamp.valueOf("2019-12-06 01:00:00");
		order.setStartTime(sTimestamp);
		order.setEndTime(eTimestamp);
		order.setState((short)0);
		
		orderMapper.updateOrderById(order);
		orders = orderMapper.findOrderBySiteId(1);
		assertNotNull(orders);
		order = orders.get(0);
		
		assertEquals(sTimestamp, order.getStartTime());
		assertEquals(eTimestamp, order.getEndTime());
		assertEquals(0, order.getState());
	}
	
	@Test
	public void should_find_order_contains_time()
	{
		Order order = new Order();
		
		order.setSiteId(1);
		order.setUserId(7);
		order.setStartTime(Timestamp.valueOf("2019-12-05 00:00:00"));
		order.setEndTime(Timestamp.valueOf("2019-12-05 01:00:00"));
		order.setState((short)2);
		orderMapper.insertOrder(order);
		
		Timestamp timestamp = Timestamp.valueOf("2019-12-05 00:00:00");
		
		List<Order> orders = orderMapper.findOrderByStartTimeAndEndTime(timestamp);
		
		assertNotNull(orders);
		assertEquals(1, orders.size());
		//System.out.println(orders.size());
	}
	
}
