package com.tcg.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcg.entity.Site;
import com.tcg.mapper.SiteMapper;
import com.tcg.service.SiteService;

/**
 * 
 * @author tcg
 *
 */

@Service
public class SiteServiceImpl implements SiteService
{
	@Autowired
	SiteMapper siteMapper;

	@Override
	public int insertSite(Site site)
	{
		return siteMapper.insertSite(site);
	}

	@Override
	public int updateSiteById(Site site)
	{
		return siteMapper.updateSiteById(site);
	}

	@Override
	public int deleteSiteById(int id)
	{
		return siteMapper.deleteSiteById(id);
	}

	@Override
	public List<Site> findAllSites()
	{
		return siteMapper.findAllSites();
	}

	@Override
	public Site findSiteById(int id)
	{
		return siteMapper.findSiteById(id);
	}

	@Override
	public Site findSiteByName(String name)
	{
		return siteMapper.findSiteByName(name);
	}

}
