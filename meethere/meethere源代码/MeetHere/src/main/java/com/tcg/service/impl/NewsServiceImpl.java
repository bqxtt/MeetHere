package com.tcg.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcg.entity.News;
import com.tcg.mapper.NewsMapper;
import com.tcg.service.NewsService;

/**
 * 
 * @author tcg
 *
 */

@Service
public class NewsServiceImpl implements NewsService
{
	@Autowired
	NewsMapper newsMapper;
	
	@Override
	public int insertNews(News news)
	{
		return newsMapper.insertNews(news);
	}

	@Override
	public int updateNewsById(News news)
	{
		return newsMapper.updateNewsById(news);
	}

	@Override
	public int deleteNewsById(int id)
	{
		return newsMapper.deleteNewsById(id);
	}

	@Override
	public List<News> findAllNews()
	{
		return newsMapper.findAllNews();
	}

	@Override
	public News findNewsById(int id)
	{

		return newsMapper.findNewsById(id);
	}

}
