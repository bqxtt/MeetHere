package com.tcg.mapper;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.tcg.entity.Order;

/**
 * 
 * @author tcg
 *
 */

@Mapper
public interface OrderMapper
{
	/**
	 * insertOrder
	 * @param order
	 * @return int
	 */
	@Insert("insert into orders(userId,siteId,startTime,endTime,state)\n"
			+ "values(#{userId},#{siteId},#{startTime},#{endTime},#{state})")
	public int insertOrder(Order order);

	/**
	 * updateOrderById
	 * @param order
	 * @return int
	 */
	@Update("update orders set startTime = #{startTime},endTime = #{endTime},state = #{state}\n"
			+ "where orderId = #{orderId}")
	public int updateOrderById(Order order);

	/**
	 * findOrderByStartTimeAndEndTime
	 * @param time
	 * @return List<Order>
	 */
	@Select("select * from orders \n" 
			+ "where unix_timestamp(startTime) <= unix_timestamp(#{time}) \n" 
			+ "and unix_timestamp(#{time}) <= unix_timestamp(EndTime) \n" 
			+ "and state = 2")
	public List<Order> findOrderByStartTimeAndEndTime(@Param("time") Timestamp time);
	
	/**
	 * findOrderByUserId
	 * @param userId
	 * @return List<Order>
	 */
	@Select("select * from orders where userId = #{userId}")
	public List<Order> findOrderByUserId(@Param("userId") int userId);
	
	/**
	 * findOrderBySiteId
	 * @param siteId
	 * @return List<Order>
	 */
	@Select("select * from orders where siteId = #{siteId}")
	public List<Order> findOrderBySiteId(@Param("siteId") int siteId);
	
	/**
	 * findOrderById
	 * @param orderId
	 * @return Order
	 */
	@Select("select * from orders where orderId = #{orderId}")
	public Order findOrderById(@Param("orderId") int orderId);

	/**
	 * findAllOrders
	 * @return List<Order>
	 */
	@Select("select * from orders")
	public List<Order> findAllOrders();
	
	/**
	 * deleteOrderById
	 * @param id
	 * @return int
	 */
	@Delete("delete from orders where orderId = #{id}")
	public int deleteOrderById(@Param("id") int id);
}
