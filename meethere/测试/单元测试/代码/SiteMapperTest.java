package com.tcg.mapper;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import com.tcg.entity.Site;

@Transactional
@RunWith(SpringRunner.class)
@SpringBootTest
class SiteMapperTest
{
	@Autowired
	SiteMapper siteMapper;
	
	@Test
	public void should_insert_a_site()
	{
		Site site = new Site();
		site.setName("test");
		
		int t = siteMapper.insertSite(site);
		assertEquals(1, t);
	}
	
	/*
	 * 需要在数据库中插入siteId为1的site
	 * */
	@Test
	public void should_update_name_by_id()
	{	
		Site site = siteMapper.findSiteById(1);
		assertNotNull(site);
		
		site.setName("test1");
		siteMapper.updateSiteById(site);
		
		
		assertEquals("test1", site.getName());
	}

	/*
	 * 需要先行在数据库中插入siteId为1的site
	 * */
	@Test
	public void should_delete_site_by_id()
	{
		Site site = siteMapper.findSiteById(1);
		assertNotNull(site);
		
		int t = siteMapper.deleteSiteById(1);
		assertEquals(1, t);
		
		site = siteMapper.findSiteById(1);
		assertNull(site);
	}
}
