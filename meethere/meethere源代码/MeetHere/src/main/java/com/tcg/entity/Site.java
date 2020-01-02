package com.tcg.entity;

/**
 * 
 * @author tcg
 *
 */

public class Site
{
	private int siteId;
	private String name;
	private String imagePath;
	private String description;
	private String location;
	private double price;

	public int getSiteId()
	{
		return siteId;
	}
	public void setSiteId(int siteId)
	{
		this.siteId = siteId;
	}
	public String getName()
	{
		return name;
	}
	public void setName(String name)
	{
		this.name = name;
	}
	public String getDescription()
	{
		return description;
	}
	public void setDescription(String description)
	{
		this.description = description;
	}
	public String getLocation()
	{
		return location;
	}
	public void setLocation(String location)
	{
		this.location = location;
	}
	public double getPrice()
	{
		return price;
	}
	public void setPrice(double price)
	{
		this.price = price;
	}
	public String getImagePath()
	{
		return imagePath;
	}
	public void setImagePath(String imagePath)
	{
		this.imagePath = imagePath;
	}
	
}
