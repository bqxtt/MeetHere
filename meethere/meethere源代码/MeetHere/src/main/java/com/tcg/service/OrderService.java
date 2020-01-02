package com.tcg.service;

import java.sql.Timestamp;
import java.util.List;


import com.tcg.entity.Order;

/**
 * 
 * @author tcg
 *
 */

public interface OrderService
{
	/**
	 * insertOrder
	 * @param order
	 * @return int
	 */
	public int insertOrder(Order order);

	/**
	 * updateOrderById
	 * @param order
	 * @return int
	 */
	public int updateOrderById(Order order);

	/**
	 * findOrderByStartTimeAndEndTime
	 * @param time
	 * @return List<Order>
	 */
	public List<Order> findOrderByStartTimeAndEndTime(Timestamp time);
	
	/**
	 * findOrderByUserId
	 * @param userId
	 * @return List<Order>
	 */
	public List<Order> findOrderByUserId(int userId);
	
	/**
	 * findOrderBySiteId
	 * @param siteId
	 * @return List<Order>
	 */
	public List<Order> findOrderBySiteId(int siteId);
	
	/**
	 * findAllOrders
	 * @return List<Order>
	 */
	public List<Order> findAllOrders();
	
	/**
	 * findOrderById
	 * @param orderId
	 * @return Order
	 */
	public Order findOrderById(int orderId);
	
	/**
	 * deleteOrderById
	 * @param id
	 * @return int
	 */
	public int deleteOrderById(int id);
}
