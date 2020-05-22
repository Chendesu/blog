-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2020-05-22 17:20:00
-- 服务器版本： 5.7.26
-- PHP 版本： 7.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `myblog`
--

-- --------------------------------------------------------

--
-- 表的结构 `photo`
--

CREATE TABLE `photo` (
  `id` int(4) NOT NULL,
  `username` varchar(50) NOT NULL,
  `phototitle` varchar(50) NOT NULL,
  `photourl` varchar(100) NOT NULL,
  `photocontent` text,
  `phototime` varchar(50) NOT NULL,
  `photolabel` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `photo`
--

INSERT INTO `photo` (`id`, `username`, `phototitle`, `photourl`, `photocontent`, `phototime`, `photolabel`) VALUES
(2, 'admin', '图片', 'qa75ul3w1.bkt.clouddn.com/15894449645ebd0164128ad.jpg', '图片图片', '2020-05-14 16:29:24', '生活'),
(3, 'admin', 'cry', 'qa75ul3w1.bkt.clouddn.com/15894458825ebd04fabe671.jpg', 'test', '2020-05-14 16:44:42', '生活'),
(4, 'admin', '123', 'qa75ul3w1.bkt.clouddn.com/15894473935ebd0ae1cd004.jpg', '', '2020-05-14 17:09:53', 'idol'),
(5, 'admin', '123', 'qa75ul3w1.bkt.clouddn.com/15894474085ebd0af0acde7.jpg', '', '2020-05-14 17:10:08', 'idol'),
(6, 'admin', 'test', 'qa75ul3w1.bkt.clouddn.com/15894482975ebd0e69f103b.gif', '111', '2020-05-14 17:24:57', '测试'),
(11, 'admin', '苹果', 'qa75ul3w1.bkt.clouddn.com/15898783525ec39e50b654b.png', '这是苹果', '2020-05-19 16:52:32', '水果'),
(10, 'chen', '测试', 'qa75ul3w1.bkt.clouddn.com/15895240865ebe3676cf20d.jpg', '测试测试', '2020-05-15 14:28:06', '测试');

--
-- 转储表的索引
--

--
-- 表的索引 `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `photo`
--
ALTER TABLE `photo`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
