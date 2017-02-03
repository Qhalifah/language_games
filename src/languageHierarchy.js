EVENKI_HIERARCHY = {nodeName: 'Эвенкийский', 
												children: [
													{nodeName: 'Северное наречие', 
												 			children:
												 			[
												 				{nodeName: 'Чириндинский говор', enabled: true, isLeaf: true, dialectCode : 'EvenkiChirinda'},
												 				{nodeName: 'Тутончанский говор', enabled: true, isLeaf: true, dialectCode : 'EvenkiTutonchany'},
																{nodeName: 'Хантайский говор', enabled: false, isLeaf: true},
																{nodeName: 'Игаркинский говор', enabled: false, isLeaf: true}
											   				]
											   		},
											   		
											   		
													{nodeName: 'Южное наречие', 
															children: [
																{nodeName: 'Говор Стрелки-Чуни', enabled: true, isLeaf: true, dialectCode : 'EvenkiStrelka'},
																/*{nodeName: 'Сымский диалект', 
															 			children:
															 			[
															 				{nodeName: 'Говор Белого Яра', enabled: false, isLeaf: true},
																			{nodeName: 'Говор Сыма', enabled: false, isLeaf: true},
														   				
														   				]
														   		},*/
															]
													},	
													
													{
														nodeName: 'Восточное наречие', 
														children: []
													}
												 	
											   	],
											   	isLanguage: true
											   };
											   
SELKUP_HIERARCHY = {nodeName: 'Селькупский', 
														children: [
										
													{nodeName: 'Северное наречие', 
															children: [
																{nodeName: 'Среднетазовский говор', enabled: true, isLeaf: true, dialectCode : 'SelkupMiddleTaz'},
																{nodeName: 'Верхнетолькинский говор', enabled: true, isLeaf: true, dialectCode : 'SelkupUpperTolka'},
																{nodeName: 'Верхнетазовский говор', enabled: false, isLeaf: true,},
															]},
															
													{nodeName: 'Центральное наречие', 
															children: []},
															
													{nodeName: 'Южное наречие', 
															children: [
																/*{
																	nodeName: 'Верхнекетский диалект',
																	children: []
																}*/
															]},	
													
												 	
											   	],
											   	isLanguage: true
											   };
KET_HIERARCHY = {nodeName:'Кетский', children:[

								{nodeName: 'Северный диалект', 
															children: []},
								{nodeName: 'Центральный диалект', 
															children: []},

								{nodeName: 'Южный диалект', 
															children: [
																{nodeName: 'Подкаменнотунгусский говор', enabled: true, isLeaf: true, dialectCode : 'KetPodkamennaya'},
																{nodeName: 'Елогуйский говор', enabled: true, isLeaf: true, dialectCode : 'KetYeloguy'},
															]},


], isLanguage: true};