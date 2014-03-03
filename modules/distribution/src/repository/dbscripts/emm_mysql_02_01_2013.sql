CREATE DATABASE  IF NOT EXISTS `EMM_DB` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `EMM_DB`;
-- MySQL dump 10.13  Distrib 5.5.29, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: EMM_DB
-- ------------------------------------------------------
-- Server version	5.5.29-0ubuntu0.12.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenant_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `platform_id` int(11) DEFAULT NULL,
  `reg_id` longtext,
  `os_version` varchar(45) DEFAULT NULL,
  `properties` text,
  `created_date` datetime DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `byod` smallint(6) DEFAULT '1',
  `deleted` int(11) DEFAULT '0',
  `vendor` varchar(11) DEFAULT NULL,
  `udid` VARCHAR(4096) NULL DEFAULT NULL,
  `push_token` VARCHAR(256) NULL DEFAULT NULL,
  `wifi_mac` varchar(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1022 DEFAULT CHARSET=latin1;

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `featuregroup`
--

DROP TABLE IF EXISTS `featuregroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `featuregroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COMMENT='MAM,MDM';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featuregroup`
--

LOCK TABLES `featuregroup` WRITE;
/*!40000 ALTER TABLE `featuregroup` DISABLE KEYS */;
INSERT INTO `featuregroup` VALUES (1,'MDM_OPERATION','Operations'),(2,'MAM','Application'),(3,'MMM','Messaging'),(4,'MDM_CONFIGURATION','Configuration'),(5,'MDM_INFO','Information');
/*!40000 ALTER TABLE `featuregroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `description` varchar(45) NOT NULL,
  `deleted` smallint(6) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `monitor` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fkgroupid` (`group_id`),
  CONSTRAINT `fkgroupid` FOREIGN KEY (`group_id`) REFERENCES `featuregroup` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `features`
--

LOCK TABLES `features` WRITE;
/*!40000 ALTER TABLE `features` DISABLE KEYS */;
INSERT INTO `features` VALUES (1,'LOCK','503A','Device Lock',0,1,1,0),(2,'WIPE','504A','Wipe',0,1,1,0),(3,'CLEARPASSWORD','505A','Clear',0,1,1,0),(4,'APPLIST','502A','Get All Applications',0,2,2,1),(5,'LOCATION','501A','Location',0,1,2,0),(6,'INFO','500A','Device Information',0,5,2,1),(7,'NOTIFICATION','506A','Message',0,3,1,0),(8,'WIFI','507A','Wifi',0,4,1,0),(9,'CAMERA','508A','Camera',0,1,1,0),(12,'MUTE','513A','Mute Device',0,1,1,0),(13,'INSTALLAPP','509A','Install Application',0,2,3,0),(14,'UNINSTALLAPP','510A','Uninstall Application',0,2,3,0),(15,'ENCRYPT','511A','Encrypt Storage',0,1,1,0),(16,'APN','512A','APN',0,4,1,0),(21,'WEBCLIP','518A','Create Webclips',0,4,3,0),(22,'PASSWORDPOLICY','519A','Password Policy',0,4,1,0),(23,'EMAIL','520A','Email Configuration',0,4,1,0),(24,'GOOGLECALENDAR','521A','Calender Subscription',0,4,1,0),(26,'VPN','523A','VPN',0,4,1,0),(27,'LDAP','524A','LDAP',0,4,1,0),(29,'CHANGEPASSWORD','526A','Set Password',0,4,1,0),(30,'ENTERPRISEWIPE','527A','Enterprise Wipe',0,1,1,0),(31,'POLICY','500P','Policy Enforcement',0,4,1,0),(32,'MONITORING','501P','Policy Monitoring ',0,5,1,1),(33,'BLACKLISTAPPS','528B','Blacklist Apps',0,2,1,0);
/*!40000 ALTER TABLE `features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `featuretype`
--

DROP TABLE IF EXISTS `featuretype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `featuretype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COMMENT='Critical,Working';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featuretype`
--

LOCK TABLES `featuretype` WRITE;
/*!40000 ALTER TABLE `featuretype` DISABLE KEYS */;
INSERT INTO `featuretype` VALUES (1,'OPERATION','Can do groups, users, devices',0),(2,'INFO','Only for devices',0),(3,'APPLICATION','application related stuff',0);
/*!40000 ALTER TABLE `featuretype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_policy_mapping`
--

DROP TABLE IF EXISTS `group_policy_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_policy_mapping` (
  `group_id` varchar(45) NOT NULL DEFAULT '',
  `policy_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`group_id`,`policy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_policy_mapping`
--

LOCK TABLES `group_policy_mapping` WRITE;
/*!40000 ALTER TABLE `group_policy_mapping` DISABLE KEYS */;
INSERT INTO `group_policy_mapping` VALUES ('admin',44),('Sales',44);
/*!40000 ALTER TABLE `group_policy_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) DEFAULT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `device_id` int(11) DEFAULT NULL,
  `message` text,
  `status` varchar(1) DEFAULT NULL,
  `sent_date` datetime DEFAULT NULL,
  `received_date` datetime DEFAULT NULL,
  `received_data` longtext CHARACTER SET utf8,
  `feature_code` varchar(45) DEFAULT NULL,
  `feature_description` varchar(200) DEFAULT NULL,
  `tenant_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2972 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform_policy_mapping`
--

DROP TABLE IF EXISTS `platform_policy_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platform_policy_mapping` (
  `platform_id` varchar(45) NOT NULL,
  `policy_id` varchar(45) NOT NULL,
  PRIMARY KEY (`platform_id`,`policy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform_policy_mapping`
--

LOCK TABLES `platform_policy_mapping` WRITE;
/*!40000 ALTER TABLE `platform_policy_mapping` DISABLE KEYS */;
INSERT INTO `platform_policy_mapping` VALUES ('android','44');
/*!40000 ALTER TABLE `platform_policy_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platformfeatures`
--

DROP TABLE IF EXISTS `platformfeatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platformfeatures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform_id` int(11) DEFAULT NULL,
  `feature_id` int(11) DEFAULT NULL,
  `min_version` varchar(45) DEFAULT NULL,
  `max_version` varchar(45) DEFAULT NULL,
  `template` mediumtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platformfeatures`
--

LOCK TABLES `platformfeatures` WRITE;
/*!40000 ALTER TABLE `platformfeatures` DISABLE KEYS */;
INSERT INTO `platformfeatures` VALUES (1,1,1,'2.2','',''),(2,1,2,'2.2','','wipe'),(3,1,3,'2.2','',''),(4,1,4,'2.2','',''),(5,1,5,'2.2','',''),(6,1,6,'2.2','',''),(7,1,7,'2.2','','notifications'),(8,1,8,'2.2','','wifi'),(9,1,9,'4.0','','camera'),(12,1,12,'2.2','',''),(13,2,1,'4.0','5.0',NULL),(15,2,3,'4.0','5.0',''),(16,2,4,'4.0','5.0',NULL),(17,2,6,'4.0','5.0',NULL),(18,2,8,'4.0','5.0','wifi'),(19,2,9,'4.0','5.0','camera'),(21,3,1,'4.0','5.0',NULL),(23,3,3,'4.0','5.0',''),(24,3,4,'4.0','5.0',NULL),(25,3,6,'4.0','5.0',NULL),(26,3,8,'4.0','5.0','wifi'),(28,3,9,'4.0','5.0','camera'),(30,4,1,'4.0','5.0',NULL),(32,4,3,'4.0','5.0',''),(33,4,4,'4.0','5.0',NULL),(34,4,6,'4.0','5.0',NULL),(35,4,8,'4.0','5.0','wifi'),(36,4,9,'4.0','5.0','camera'),(37,1,15,'3.0',NULL,'encrypt'),(38,1,17,'2.2',NULL,NULL),(39,1,18,'2.2',NULL,NULL),(43,1,19,'2.2',NULL,NULL),(44,1,20,'2.2',NULL,NULL),(45,1,21,'2.2',NULL,'webclip'),(46,1,22,'2.2',NULL,'password_policy'),(49,2,21,'4.0','5.0','webclip'),(50,2,22,'4.0','5.0','password_policy'),(51,3,23,'4.0','5.0','email'),(52,3,24,'4.0','5.0','google_calendar'),(53,3,21,'4.0','5.0','webclip'),(54,3,22,'4.0','5.0','password_policy'),(55,2,23,'4.0','5.0','email'),(56,2,24,'4.0','5.0','google_calendar'),(57,1,25,'2.2',NULL,NULL),(58,1,29,'2.2',NULL,'change-password'),(59,2,30,'4.0','5.0',NULL),(60,3,30,'4.0','5.0',NULL),(61,2,16,'4.0','5.0','apn'),(62,3,16,'4.0','5.0','apn'),(63,2,26,'4.0','5.0','vpn'),(64,3,26,'4.0','5.0','vpn'),(65,2,27,'4.0','5.0','ldap'),(66,3,27,'4.0','5.0','ldap'),(67,1,23,'2.2',NULL,'email'),(68,1,31,'2.2',NULL,NULL),(69,2,31,'2.2',NULL,NULL),(70,3,31,'2.2',NULL,NULL),(71,4,31,'2.2',NULL,NULL);
/*!40000 ALTER TABLE `platformfeatures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platforms`
--

DROP TABLE IF EXISTS `platforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platforms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `type_name` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platforms`
--

LOCK TABLES `platforms` WRITE;
/*!40000 ALTER TABLE `platforms` DISABLE KEYS */;
INSERT INTO `platforms` VALUES (1,'Android','android phones and tabs','1','Android','#028482'),(2,'iPhone','iphone','2','iOS','#CCCCCC'),(3,'iPad','ipad','2','iOS','#CCCCCC'),(4,'iPod','ipod','2','iOS','#CCCCCC');
/*!40000 ALTER TABLE `platforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policies`
--

DROP TABLE IF EXISTS `policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `policies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `content` text,
  `type` tinyint(4) DEFAULT NULL,
  `category` tinyint(4) DEFAULT NULL,
  `tenant_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policies`
--

LOCK TABLES `policies` WRITE;
/*!40000 ALTER TABLE `policies` DISABLE KEYS */;
/*!40000 ALTER TABLE `policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenantplatformfeatures`
--

DROP TABLE IF EXISTS `tenantplatformfeatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tenantplatformfeatures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tenant_id` varchar(45) DEFAULT NULL,
  `platformFeature_Id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenantplatformfeatures`
--

LOCK TABLES `tenantplatformfeatures` WRITE;
/*!40000 ALTER TABLE `tenantplatformfeatures` DISABLE KEYS */;
INSERT INTO `tenantplatformfeatures` VALUES (1,'1',1),(2,'1',2),(3,'1',3),(4,'1',4),(5,'1',5),(6,'1',6),(7,'1',7),(8,'1',8),(9,'1',9),(10,'1',10),(11,'1',11),(12,'1',12),(13,'2',1),(14,'2',2),(15,'2',3),(16,'2',4),(17,'2',6),(18,'2',8),(19,'2',9),(20,'2',12),(21,'3',1),(22,'3',2),(23,'3',3),(24,'3',4),(25,'3',6),(26,'3',8),(27,'3',9),(28,'4',1),(29,'4',2),(30,'4',3),(31,'4',6),(32,'4',8),(33,'4',9),(34,'4',12),(35,'-1234',1),(36,'-1234',2),(37,'-1234',3),(38,'-1234',4),(39,'-1234',5),(40,'-1234',6),(41,'-1234',7),(42,'-1234',8),(43,'-1234',9),(44,'-1234',10),(45,'-1234',11),(46,'-1234',12);
/*!40000 ALTER TABLE `tenantplatformfeatures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_policy_mapping`
--

DROP TABLE IF EXISTS `user_policy_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_policy_mapping` (
  `user_id` varchar(45) NOT NULL,
  `policy_id` int(11) NOT NULL,
  PRIMARY KEY (`policy_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_policy_mapping`
--

LOCK TABLES `user_policy_mapping` WRITE;
/*!40000 ALTER TABLE `user_policy_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_policy_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_awake`
--

DROP TABLE IF EXISTS `device_awake`;
CREATE  TABLE `EMM_DB`.`device_awake` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `device_id` INT(11) NULL DEFAULT NULL ,
  `sent_date` DATETIME NULL DEFAULT NULL ,
  `processed_date` DATETIME NULL DEFAULT NULL ,
  `call_count` INT(11) NULL DEFAULT 1 ,
  `status` VARCHAR(1) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `device_id` (`device_id` ASC) )
COMMENT = 'status will be S (Sent), P (Processed), E (Error / Exception) and D (Deleted)';


--
-- Table structure for table `device_pending`
--

DROP TABLE IF EXISTS `device_pending`;
CREATE  TABLE `EMM_DB`.`device_pending` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `tenant_id` INT(11) NULL DEFAULT NULL ,
  `user_id` VARCHAR(255) NULL DEFAULT NULL ,
  `platform_id` INT(11) NULL DEFAULT NULL ,
  `properties` TEXT NULL DEFAULT NULL ,
  `created_date` DATETIME NULL DEFAULT NULL ,
  `status` VARCHAR(10) NULL DEFAULT NULL ,
  `byod` SMALLINT NULL DEFAULT 1 ,
  `vendor` VARCHAR(11) NULL DEFAULT NULL ,
  `udid` VARCHAR(4096) NULL DEFAULT NULL ,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) ,
  INDEX `UDID` (`udid` ASC),
  INDEX `TOKEN` (`token` ASC) );


--
-- Table structure for table `policy_device_profiles`
--

DROP TABLE IF EXISTS `policy_device_profiles`;
CREATE TABLE `policy_device_profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `feature_code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1022 DEFAULT CHARSET=latin1;

LOCK TABLES `policy_device_profiles` WRITE;
/*!40000 ALTER TABLE `policy_device_profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `policy_device_profiles` ENABLE KEYS */;
UNLOCK TABLES;


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

