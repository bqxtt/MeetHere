package com.tcg.mapper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.lenient;

import java.sql.Timestamp;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import com.tcg.entity.News;

@Transactional
@RunWith(SpringRunner.class)
@SpringBootTest
class NewsMapperTest
{
	@Autowired
	NewsMapper newsMapper;
	
	@Test
	public void should_insert_news()
	{
		News news = new News();
		news.setTitle("testTitle");
		news.setContent("testContent");
		news.setReleaseTime(Timestamp.valueOf("2019-12-05 00:00:00"));
		
		int t = newsMapper.insertNews(news);
		assertEquals(1, t);
	}
	
	@Test
	public void should_update_news_by_id()
	{
		News news = new News();
		news.setTitle("testTitle");
		news.setContent("testContent");
		news.setReleaseTime(Timestamp.valueOf("2019-12-05 00:00:00"));
		newsMapper.insertNews(news);
		
		news = newsMapper.findNewsByTitle("testTitle");
		assertNotNull(news);
		
		news.setTitle("testChangeTitle");
		news.setContent("testChangeContent");
		newsMapper.updateNewsById(news);
		
		int id = news.getNewsId();
		news = newsMapper.findNewsById(id);
		assertNotNull(news);
		
		assertEquals("testChangeTitle", news.getTitle());
		assertEquals("testChangeContent", news.getContent());
	}
	
	@Test
	public void should_delete_news_by_id()
	{
		News news = new News();
		news.setTitle("testTitle");
		news.setContent("testContent");
		news.setReleaseTime(Timestamp.valueOf("2019-12-05 00:00:00"));
		newsMapper.insertNews(news);
		news = newsMapper.findNewsByTitle("testTitle");
		
		int id = news.getNewsId();
		int t = newsMapper.deleteNewsById(id);
		assertEquals(1, t);
		
		news = newsMapper.findNewsById(id);
		assertNull(news);
	}
	
}
