-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2020-05-09 17:24:26
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
-- 表的结构 `diary`
--

CREATE TABLE `diary` (
  `id` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `diarytitle` varchar(100) NOT NULL,
  `diarycontent` text NOT NULL,
  `diarytime` varchar(30) NOT NULL,
  `diaryread` int(4) NOT NULL,
  `diarylabel` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `diary`
--

INSERT INTO `diary` (`id`, `username`, `diarytitle`, `diarycontent`, `diarytime`, `diaryread`, `diarylabel`) VALUES
(10, 'chen', '新的文章', '<p>这是一篇新的文章233333333333~</p>', '2020-05-09 11:25:33', 0, '生活'),
(6, 'admin', '周五', '<p>2333333</p>', '2020-05-08 16:28:49', 0, '生活'),
(7, 'admin', '周六', '<p>明天周六！！！！！！！！！！</p>', '2020-05-08 16:32:00', 0, '生活'),
(8, 'admin', 'test', '<p>aaaaa</p>', '2020-05-08 16:36:20', 0, '生活'),
(9, 'admin', 'ceshi123', 'test123<p><br></p>', '2020-05-08 16:37:22', 0, '123');

--
-- 转储表的索引
--

--
-- 表的索引 `diary`
--
ALTER TABLE `diary`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `diary`
--
ALTER TABLE `diary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
