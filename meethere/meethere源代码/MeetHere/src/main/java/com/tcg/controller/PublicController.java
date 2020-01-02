package com.tcg.controller;

import static org.hamcrest.CoreMatchers.nullValue;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.tcg.entity.Message;
import com.tcg.entity.News;
import com.tcg.entity.Site;
import com.tcg.entity.UserInfo;
import com.tcg.service.MessageService;
import com.tcg.service.NewsService;
import com.tcg.service.SiteService;
import com.tcg.service.UserInfoService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;


/**
 * 
 * @author tcg
 *
 */

@Controller
@RequestMapping("/public")
@Api(tags = "公共接口")
public class PublicController
{
	@Autowired
	NewsService newsService;
	@Autowired
	MessageService messageService; 
	@Autowired
	SiteService siteService;
	@Autowired
	UserInfoService userInfoService;
	
	@ResponseBody
	@GetMapping(value = "/news")
	@ApiOperation(value = "获取新闻列表",notes = "返回jsonString，包含所有新闻，其中imagePath为base64url")
	public String news() throws IOException
	{
		List<News> news = newsService.findAllNews();
		for(News tmpNews : news)
		{
			if(tmpNews.getImagePath() == null || tmpNews.getImagePath().equals(""))
			{
				tmpNews.setImagePath("");
				continue;
			}
			File imageFile = new File(tmpNews.getImagePath());
			if(imageFile.exists())
			{
				FileInputStream fis = new FileInputStream(imageFile);
				try
				{
					int iAvail = fis.available();
		            byte[] bytes = new byte[iAvail];
		            fis.read(bytes);
		            tmpNews.setImagePath(new String(bytes));
				} finally
				{
					fis.close();
				}

				
			}
			else 
			{
				tmpNews.setImagePath("");
			}
		}
		
		return JSON.toJSONString(news);
	}
	
	@GetMapping(value = "/news/{newsId}")
	@ApiOperation(value = "获取新闻内容",notes = "直接返回页面")
	public String newsId(@PathVariable("newsId") int newsId,Model model) throws IOException
	{
		News news = newsService.findNewsById(newsId);
		if(news.getImagePath() == null || news.getImagePath().equals(""))
		{
			news.setImagePath("");
		}
		File imageFile = new File(news.getImagePath());
		if(imageFile.exists())
		{
			FileInputStream fis = new FileInputStream(imageFile);
			try
			{
				int iAvail = fis.available();
	            byte[] bytes = new byte[iAvail];
	            fis.read(bytes);
	            news.setImagePath(new String(bytes));
			} finally
			{
				fis.close();
			}

			
		}
		else 
		{
			news.setImagePath("");
		}
		
		model.addAttribute("news",news);
		
		return "newsId";
	}
	
	
	
	@ResponseBody
	@GetMapping("/messages")
	@ApiOperation(value = "获取留言列表",notes = "返回JsonString，包含所有根留言")
	public String messages()
	{
		List<Message> messages = messageService.findMessagesByParentId(0);
		return JSON.toJSONString(messages);
	}
	
	@ResponseBody
	@GetMapping("/messages/{parentId}")
	@ApiOperation(value = "获取回复留言列表",notes = "返回JsonString，包含所有回复留言")
	public String messagesReply(@PathVariable("parentId") int parentId)
	{
		List<Message> messages = messageService.findMessagesByParentId(parentId);
		return JSON.toJSONString(messages);
	}
	
	@ResponseBody
	@GetMapping("/sites")
	@ApiOperation(value = "获取场馆列表",notes = "返回JsonString，包含所有场馆，其中imagePath为base64url")
	public String sites() throws IOException
	{
		List<Site> sites = siteService.findAllSites();
		for(Site site : sites)
		{
			if(site.getImagePath() == null || site.getImagePath().equals(""))
			{
				continue;
			}
			File imageFile = new File(site.getImagePath());
			if(imageFile.exists())
			{
				FileInputStream fis = new FileInputStream(imageFile);
				try
				{
		            int iAvail = fis.available();
		            byte[] bytes = new byte[iAvail];
		            fis.read(bytes);
		            site.setImagePath(new String(bytes));					
				} finally
				{
					fis.close();
				}

				
			}
			else 
			{
				site.setImagePath("");
			}
		}
		
		return JSON.toJSONString(sites);
	}
	
	@GetMapping("/login")
	@ApiOperation(value = "登录界面",notes = "login.html将登录数据（username，password）发送至/login即可，失败重定向至/login?error")
	public String login()
	{
		return "login";
	}
	
	@GetMapping("/reg")
	public String reg()
	{
		return "register";
	}
	
	
	
	@ResponseBody
	@PostMapping("/register")
	@ApiOperation(value = "注册用户",notes = "返回String，成功success，失败fail")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "username",required = true,paramType = "query"),
			@ApiImplicitParam(name = "password",required = true,paramType = "query"),
			@ApiImplicitParam(name = "email",required = true,paramType = "query"),
			@ApiImplicitParam(name = "telephone",required = true,paramType = "query")
	})
	public String register(
			@RequestParam("username") String username,
			@RequestParam("password") String password,
			@RequestParam("email") String email,
			@RequestParam("telephone") String telephone
	)
	{
		UserInfo userInfo = new UserInfo();
		userInfo.setUsername(username);
		password = new BCryptPasswordEncoder().encode(password);
		userInfo.setPassword(password);
		userInfo.setRoles("ROLE_USER");
		userInfo.setEmail(email);
		userInfo.setTelephone(telephone);
		
		
		int t = userInfoService.insertUser(userInfo);
		if(t == 1)
		{
			return "success";
		}
		else 
		{
			return "fail";
		}
	}
	
	@RequestMapping(value = "/{html}",method = {RequestMethod.POST,RequestMethod.GET})
	public String redirect(@PathVariable("html") String html)
	{
		return html;
	}
	
	
	
	@GetMapping("/")
	public String index()
	{
		return "index";
	}
	
}
