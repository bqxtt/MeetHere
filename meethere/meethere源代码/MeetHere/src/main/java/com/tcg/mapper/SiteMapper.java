package com.tcg.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.tcg.entity.Site;

/**
 * 
 * @author tcg
 *
 */

@Mapper
public interface SiteMapper
{
	/**
	 * insertSite
	 * @param site
	 * @return int
	 */
	@Insert("insert into site(name,imagePath,description,location,price)\n"
			 + "values(#{name},#{imagePath},#{description},#{location},#{price})")
	public int insertSite(Site site);

	/**
	 * updateSiteById
	 * @param site
	 * @return int
	 */
	@Update("update site set name = #{name},description = #{description},location = #{location},price = #{price}\n"
			+ "where siteId = #{siteId}")
	public int updateSiteById(Site site);

	/**
	 * deleteSiteById
	 * @param id
	 * @return int
	 */
	@Delete("delete from site where siteId = #{id}")
	public int deleteSiteById(@Param("id") int id);

	/**
	 * findAllSites
	 * @return List<Site>
	 */
	@Select("select * from site")
	public List<Site> findAllSites();
	
	/**
	 * findSiteById
	 * @param id
	 * @return Site
	 */
	@Select("select * from site where siteId = #{id}")
	public Site findSiteById(@Param("id") int id);

	/**
	 * findSiteByName
	 * @param name
	 * @return Site
	 */
	@Select("select * from site where name = #{name}")
	public Site findSiteByName(@Param("name") String name);
}
