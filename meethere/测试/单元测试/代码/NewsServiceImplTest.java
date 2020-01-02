package com.tcg.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Timestamp;
import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import com.tcg.entity.News;
import com.tcg.mapper.NewsMapper;
import com.tcg.service.NewsService;

@RunWith(SpringRunner.class)
@SpringBootTest
class NewsServiceImplTest
{
	@Autowired
	NewsService newsService;
	
	@MockBean
	NewsMapper newsMapper;
	
	private News news;
	
	@Test
	public void should_insert_news_by_mapper()
	{
		news = new News();
		when(newsMapper.insertNews(Mockito.any(News.class))).thenReturn(1);
		
		int t = newsService.insertNews(news);
		verify(newsMapper).insertNews(Mockito.any(News.class));
		assertEquals(1, t);
	}
	
	@Test
	public void should_update_news_by_mapper()
	{
		news = new News();
		when(newsMapper.updateNewsById(Mockito.any(News.class))).thenReturn(1);
		
		int t = newsService.updateNewsById(news);
		verify(newsMapper).updateNewsById(Mockito.any(News.class));
		assertEquals(1, t);
	}
	
	@Test
	public void should_delete_news_by_mapper()
	{
		news = new News();
		when(newsMapper.deleteNewsById(Mockito.anyInt())).thenReturn(1);
		
		int t = newsService.deleteNewsById(1);
		verify(newsMapper).deleteNewsById(Mockito.anyInt());
		assertEquals(1, t);
	}
	
	@Test
	public void should_find_all_news_by_mapper()
	{
		when(newsMapper.findAllNews()).thenReturn(new ArrayList<News>());
		
		newsService.findAllNews();
		
		verify(newsMapper).findAllNews();
	}
	
	@Test
	public void should_find_news_by_id()
	{
		when(newsMapper.findNewsById(1)).thenReturn(new News());
		
		newsService.findNewsById(1);
		
		verify(newsMapper).findNewsById(1);
	}

}
