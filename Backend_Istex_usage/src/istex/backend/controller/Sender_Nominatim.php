<?php
//Import librairie nominatim
use \Nominatim\ParameterParser as ParameterParser;
use \Nominatim\Geocode as Geocode;
require('build/settings/settings.php');
require('lib/init-cmd.php');
require('lib/Geocode.php');
require('lib/ParameterParser.php');
ini_set('max_execution_time', 2);//timeout 2 secondes

	if (empty($argv[1])) {
		$array=array();
		$array['country']="NULL";
		$array['lat']="NULL";
		$array['lon']="NULL";
	}
	else{
		$name=$argv[1];//recuperation de l'argument(pays)
		$oDB =& getDB();//import settings bdd
		$oParams = new ParameterParser();//import parser
		$languages=$oParams->getPreferredLanguages("en");//on recupere les resultats en anglais
		$oGeocode = new Geocode($oDB);//Objet Geocode
		$oGeocode->setLanguagePreference($languages);//Set de la langue
		$oGeocode->getIncludeAddressDetails();//on inclut les details des adresses pour plus de precision lors de la recherche
		$oGeocode->loadParamArray($oParams);//On charge les parametres
		$oGeocode->setQuery($name);//on set la query
		$aSearchResults = $oGeocode->lookup();//on cherche
		if (!count($aSearchResults)==0)//Si il y a un resultat
		{
		    $array['country'] = $aSearchResults[0]['address']['country'];
		    $array['lat'] = $aSearchResults[0]['lat'];
		    $array['lon'] = $aSearchResults[0]['lon'];
		}
		else{//Sinon NULL
			$array=array();
			$array['country']="NULL";
			$array['lat']="NULL";
			$array['lon']="NULL";			
		}
	}

echo json_encode($array);//Retourne du json 