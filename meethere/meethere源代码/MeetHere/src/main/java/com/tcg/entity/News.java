package com.tcg.entity;

import java.sql.Timestamp;

/**
 * 
 * @author tcg
 *
 */

public class News
{
	private int newsId;
	private String title;
	private String content;
	private String imagePath;
	private Timestamp releaseTime;

	public int getNewsId()
	{
		return newsId;
	}
	public void setNewsId(int newsId)
	{
		this.newsId = newsId;
	}
	
	public String getTitle()
	{
		return title;
	}
	public void setTitle(String title)
	{
		this.title = title;
	}
	public String getContent()
	{
		return content;
	}
	public void setContent(String content)
	{
		this.content = content;
	}
	public String getImagePath()
	{
		return imagePath;
	}
	public void setImagePath(String imagePath)
	{
		this.imagePath = imagePath;
	}
	public Timestamp getReleaseTime()
	{
		return releaseTime;
	}
	public void setReleaseTime(Timestamp releaseTime)
	{
		this.releaseTime = releaseTime;
	}
	
}
