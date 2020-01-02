package com.tcg.service;

import java.util.List;


import com.tcg.entity.News;

/**
 * 
 * @author tcg
 *
 */

public interface NewsService
{
	/**
	 * insertNews
	 * @param news
	 * @return int
	 */
	public int insertNews(News news);

	/**
	 * updateNewsById
	 * @param news
	 * @return int
	 */
	public int updateNewsById(News news);

	/**
	 * deleteNewsById
	 * @param id
	 * @return int
	 */
	public int deleteNewsById(int id);

	/**
	 * findAllNews
	 * @return List<News>
	 */
	public List<News> findAllNews();
	
	/**
	 * findNewsById
	 * @param id
	 * @return News
	 */
	public News findNewsById(int id);
}
