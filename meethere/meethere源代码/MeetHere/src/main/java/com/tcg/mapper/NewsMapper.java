package com.tcg.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.tcg.entity.News;

/**
 * 
 * @author tcg
 *
 */

@Mapper
public interface NewsMapper
{
	/**
	 * insertNews
	 * 
	 * @param news
	 * @return int
	 */
	@Insert("insert into news(title,content,imagePath,releaseTime)\n"
			+ "values(#{title},#{content},#{imagePath},#{releaseTime})")
	public int insertNews(News news);
	
	/**
	 * updateNewsById
	 * 
	 * @param news
	 * @return int
	 */
	@Update("update news set \n"
			+ "title = #{title},\n"
			+ "content = #{content},\n" 
			+ "imagePath = #{imagePath}\n"
			+ "where newsId = #{newsId}")
	public int updateNewsById(News news);
	
	/**
	 * deleteNewsById
	 * @param id
	 * @return int
	 */
	@Delete("delete from news where newsid = #{id}")
	public int deleteNewsById(@Param("id") int id);

	/**
	 * findAllNews
	 * @return List<News>
	 */
	@Select("select * from news")
	public List<News> findAllNews();
	
	/**
	 * findNewsById
	 * @param id
	 * @return News
	 */
	@Select("select * from news where newsId = #{id}")
	public News findNewsById(@Param("id") int id);

	/**
	 * findNewsByTitle
	 * @param title
	 * @return News
	 */
	@Select("select * from news where title = #{title}")
	public News findNewsByTitle(@Param("title") String title);
}
