package com.tcg.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import com.tcg.entity.Site;
import com.tcg.mapper.SiteMapper;
import com.tcg.service.SiteService;

@RunWith(SpringRunner.class)
@SpringBootTest
class SiteServiceImplTest
{
	@Autowired
	SiteService siteService;
	
	@MockBean
	SiteMapper siteMapper;
	
	private Site site;
	
	@Test
	public void should_insert_a_site_by_mapper()
	{
		site = new Site();
		when(siteMapper.insertSite(Mockito.any(Site.class))).thenReturn(1);
		
		int t = siteService.insertSite(site);
		verify(siteMapper).insertSite(Mockito.any(Site.class));
		assertEquals(1, t);
	}
	
	@Test
	public void should_update_site_by_mapper()
	{
		site = new Site();
		when(siteMapper.updateSiteById(Mockito.any(Site.class))).thenReturn(1);
		
		int t = siteService.updateSiteById(site);
		verify(siteMapper).updateSiteById(site);
		assertEquals(1, t);
	}

	@Test
	public void should_delete_site_by_mapper()
	{
		when(siteMapper.deleteSiteById(Mockito.anyInt())).thenReturn(1);
		
		int t = siteService.deleteSiteById(1);
		verify(siteMapper).deleteSiteById(Mockito.anyInt());
		assertEquals(1, t);
	}

	@Test
	public void should_find_site_by_mapper()
	{
		when(siteMapper.findAllSites()).thenReturn(new ArrayList<Site>());
		when(siteMapper.findSiteById(Mockito.anyInt())).thenReturn(new Site());
		when(siteMapper.findSiteByName(Mockito.anyString())).thenReturn(new Site());
		
		siteService.findAllSites();
		siteService.findSiteById(1);
		siteService.findSiteByName("");
		
		verify(siteMapper).findAllSites();
		verify(siteMapper).findSiteById(Mockito.anyInt());
		verify(siteMapper).findSiteByName(Mockito.anyString());
	}
}
