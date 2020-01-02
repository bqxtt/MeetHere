package com.tcg.service;

import java.util.List;


import com.tcg.entity.Site;

/**
 * 
 * @author tcg
 *
 */

public interface SiteService
{
	/**
	 * insertSite
	 * @param site
	 * @return int
	 */
	public int insertSite(Site site);

	/**
	 * updateSiteById
	 * @param site
	 * @return int
	 */
	public int updateSiteById(Site site);

	/**
	 * deleteSiteById
	 * @param id
	 * @return int
	 */
	public int deleteSiteById(int id);

	/**
	 * findAllSites
	 * @return List<Site>
	 */
	public List<Site> findAllSites();
	
	/**
	 * findSiteById
	 * @param id
	 * @return Site
	 */
	public Site findSiteById(int id);

	/**
	 * findSiteByName
	 * @param name
	 * @return Site
	 */
	public Site findSiteByName(String name);
}
