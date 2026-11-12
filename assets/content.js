// content.js — Needle aspiration versus tube thoracostomy: a symptom-led
// management algorithm for spontaneous pneumothorax (initial confirmation ->
// tension/instability screen -> high-risk-feature screen -> symptom-led
// branch -> aspiration with a repeat-attempt loop -> ambulatory/standard
// drainage -> persistent-air-leak escalation -> recurrence prevention).
// Data only. Rendering logic lives in app.js.
// Co-authored by Dr. Özgür Karcıoğlu and Dr. Satuk Buğra Han Bozatlı.
//
// Source: Figure 1 ("Symptom-led algorithm for the management of
// spontaneous pneumothorax") of an unpublished, single/blinded-author
// manuscript, "Tube Thoracostomy Versus Needle Aspiration in the
// Management of Spontaneous Pneumothorax: A Systematic Review of Evidence
// from 2000's" (2026) — a PRISMA 2020 systematic review (PubMed/MEDLINE,
// 1 January 2000 to 31 July 2026; 7 head-to-head RCTs / >850 randomised
// participants per the review's own Table 2/Graphical Abstract tally, plus
// 2 landmark strategy RCTs and several evidence syntheses; 80 references).
// Figure 1 and the accompanying Graphical Abstract were supplied as
// separate .docx files alongside the manuscript. See METHODOLOGY.md for
// the fidelity rules this file follows: label/sub text is byte-for-byte as
// authored (figure boxes, read directly from the embedded figure image);
// meaning/rationale/cautions/refs are added research drawn from the
// manuscript's own text and tables.
//
// FIGURE-VS-TEXT DISCREPANCIES (flagged at the relevant node rather than
// silently resolved): the manuscript's narrative repeatedly presents
// "needle aspiration or ambulatory small-bore drainage" as parallel
// first-line options (Abstract, Section 4.2, Section 5, Graphical
// Abstract "Bottom Line"), while Figure 1 places ambulatory drainage
// strictly *after* a failed/repeated aspiration attempt. A number of
// granular figure details (cannula gauge, insertion sites, aspirated-
// volume ceiling, French-gauge ranges, review intervals, drain-removal
// timing) appear only in the figure and are never discussed in the
// manuscript prose — each is called out in that node's own cautions
// field, never silently backed with a citation that was never there.
//
// REFERENCES — verification policy for this tool (a deliberate,
// author-directed exception, not an oversight — the SIXTH tool in this
// atlas to carry this exception, after epinephrine-revisited-protocol,
// ketamine-indications-protocol, haloperidol-adjunct-protocol,
// geriatric-pain-protocol and metoclopramide-ondansetron-protocol): asked
// explicitly whether to extend the same policy here, the author chose to
// treat this 80-entry bibliography the same way — transcribed directly
// from the manuscript's own reference list and NOT independently
// re-verified against primary sources for this build. Every entry's kind
// field states this plainly. All 80 entries carry a DOI in the manuscript
// (none needed a PubMed-URL fallback).
const VERIFIED = "2026-11-12";

const REFERENCES = [
  { id: 1, kind: "As cited in the manuscript; not independently re-verified.", text: "Roberts ME, Rahman NM, Maskell NA, Bibby AC, Blyth KG, Corcoran JP, Edey A, Evison M, de Fonseka D, Hallifax R, Harden S, Lawrie I, Lim E, McCracken D, Mercer R, Mishra EK, Nicholson AG, Noorzad F, Opstad KS, Parsonage M, Stanton AE, Walker S. British Thoracic Society Guideline for pleural disease. Thorax. 2023;78(11):1143-1156.", url: "https://doi.org/10.1136/thorax-2023-220304" },
  { id: 2, kind: "As cited in the manuscript; not independently re-verified.", text: "Cheng HS, Wong C, Chiu PH, Tong CW, Miu PLF. Management of spontaneous pneumothorax: a mini-review on its latest evidence. J Thorac Dis. 2024;16(7):4756-4763.", url: "https://doi.org/10.21037/jtd-24-415" },
  { id: 3, kind: "As cited in the manuscript; not independently re-verified.", text: "Gupta D, Hansell A, Nichols T, Duong T, Ayres JG, Strachan D. Epidemiology of pneumothorax in England. Thorax. 2000;55(8):666-671.", url: "https://doi.org/10.1136/thorax.55.8.666" },
  { id: 4, kind: "As cited in the manuscript; not independently re-verified.", text: "Hallifax RJ, Goldacre R, Landray MJ, Rahman NM, Goldacre MJ. Trends in the incidence and recurrence of inpatient-treated spontaneous pneumothorax, 1968-2016. JAMA. 2018;320(14):1471-1480.", url: "https://doi.org/10.1001/jama.2018.14299" },
  { id: 5, kind: "As cited in the manuscript; not independently re-verified.", text: "Bobbio A, Dechartres A, Bouam S, Damotte D, Rabbat A, Regnard JF, Roche N, Alifano M. Epidemiology of spontaneous pneumothorax: gender-related differences. Thorax. 2015;70(7):653-658.", url: "https://doi.org/10.1136/thoraxjnl-2014-206577" },
  { id: 6, kind: "As cited in the manuscript; not independently re-verified.", text: "Onuki T, Ueda S, Yamaoka M, Sekiya Y, Yamada H, Kawakami N, Araki Y, Wakai Y, Saito K, Inagaki M, Matsumiya N. Primary and secondary spontaneous pneumothorax: prevalence, clinical features, and in-hospital mortality. Can Respir J. 2017;2017:6014967.", url: "https://doi.org/10.1155/2017/6014967" },
  { id: 7, kind: "As cited in the manuscript; not independently re-verified.", text: "Zhong X, Goldacre R, Morris EJA, Hallifax RJ. Trends in incidence of pneumothorax in England before, during and after the COVID-19 pandemic (2017-2023): a population-based observational study. Lancet Reg Health Eur. 2024;44:100994.", url: "https://doi.org/10.1016/j.lanepe.2024.100994" },
  { id: 8, kind: "As cited in the manuscript; not independently re-verified.", text: "Long B, Lacy AJ, Mason J, Gottlieb M. Tube thoracostomy and pleural catheters: a review for emergency clinicians. J Emerg Med. 2025;77:100-116.", url: "https://doi.org/10.1016/j.jemermed.2025.07.053" },
  { id: 9, kind: "As cited in the manuscript; not independently re-verified.", text: "Baumann MH, Strange C, Heffner JE, Light R, Kirby TJ, Klein J, Luketich JD, Panacek EA, Sahn SA. Management of spontaneous pneumothorax: an American College of Chest Physicians Delphi consensus statement. Chest. 2001;119(2):590-602.", url: "https://doi.org/10.1378/chest.119.2.590" },
  { id: 10, kind: "As cited in the manuscript; not independently re-verified.", text: "MacDuff A, Arnold A, Harvey J. Management of spontaneous pneumothorax: British Thoracic Society pleural disease guideline 2010. Thorax. 2010;65(Suppl 2):ii18-ii31.", url: "https://doi.org/10.1136/thx.2010.136986" },
  { id: 11, kind: "As cited in the manuscript; not independently re-verified.", text: "Tschopp JM, Bintcliffe O, Astoul P, Canalis E, Driesen P, Janssen J, Krasnik M, Maskell N, Van Schil P, Tonia T, Waller DA, Marquette CH, Cardillo G. ERS task force statement: diagnosis and treatment of primary spontaneous pneumothorax. Eur Respir J. 2015;46(2):321-335.", url: "https://doi.org/10.1183/09031936.00219214" },
  { id: 12, kind: "As cited in the manuscript; not independently re-verified.", text: "Walker S, Hallifax R, Ricciardi S, Fitzgerald D, Keijzers M, Lauk O, Petersen J, Bertolaccini L, Bodtger U, Clive A, Elia S, Froudarakis M, Janssen J, Lee YCG, Licht P, Massard G, Nagavci B, Neudecker J, Roessner E, Van Schil P, Waller D, Walles T, Cardillo G, Maskell N, Rahman N. Joint ERS/EACTS/ESTS clinical practice guidelines on adults with spontaneous pneumothorax. Eur Respir J. 2024;63(5):2300797.", url: "https://doi.org/10.1183/13993003.00797-2023" },
  { id: 13, kind: "As cited in the manuscript; not independently re-verified.", text: "Brown SGA, Ball EL, Perrin K, Asha SE, Braithwaite I, Egerton-Warburton D, Jones PG, Keijzers G, Kinnear FB, Kwan BCH, Lam KV, Lee YCG, Nowitz M, Read CA, Simpson G, Smith JA, Summers QA, Weatherall M, Beasley R. Conservative versus interventional treatment for spontaneous pneumothorax. N Engl J Med. 2020;382(5):405-415.", url: "https://doi.org/10.1056/NEJMoa1910775" },
  { id: 14, kind: "As cited in the manuscript; not independently re-verified.", text: "Hallifax RJ, McKeown E, Sivakumar P, Fairbairn I, Peter C, Leitch A, Knight M, Stanton A, Ijaz A, Marciniak S, Cameron J, Bhatta A, Blyth KG, Reddy R, Harris MC, Maddekar N, Walker S, West A, Laskawiec-Szkonter M, Corcoran JP, Gerry S, Roberts C, Harvey JE, Maskell N, Miller RF, Rahman NM. Ambulatory management of primary spontaneous pneumothorax: an open-label, randomised controlled trial. Lancet. 2020;396(10243):39-49.", url: "https://doi.org/10.1016/S0140-6736(20)31043-6" },
  { id: 15, kind: "As cited in the manuscript; not independently re-verified.", text: "Sterne JAC, Savović J, Page MJ, Elbers RG, Blencowe NS, Boutron I, Cates CJ, Cheng HY, Corbett MS, Eldridge SM, Emberson JR, Hernán MA, Hopewell S, Hróbjartsson A, Junqueira DR, Jüni P, Kirkham JJ, Lasserson T, Li T, McAleenan A, Reeves BC, Shepperd S, Shrier I, Stewart LA, Tilling K, White IR, Whiting PF, Higgins JPT. RoB 2: a revised tool for assessing risk of bias in randomised trials. BMJ. 2019;366:l4898.", url: "https://doi.org/10.1136/bmj.l4898" },
  { id: 16, kind: "As cited in the manuscript; not independently re-verified.", text: "Page MJ, McKenzie JE, Bossuyt PM, Boutron I, Hoffmann TC, Mulrow CD, Shamseer L, Tetzlaff JM, Akl EA, Brennan SE, Chou R, Glanville J, Grimshaw JM, Hróbjartsson A, Lalu MM, Li T, Loder EW, Mayo-Wilson E, McDonald S, McGuinness LA, Stewart LA, Thomas J, Tricco AC, Welch VA, Whiting P, Moher D. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ. 2021;372:n71.", url: "https://doi.org/10.1136/bmj.n71" },
  { id: 17, kind: "As cited in the manuscript; not independently re-verified.", text: "Higgins JPT, Thompson SG, Deeks JJ, Altman DG. Measuring inconsistency in meta-analyses. BMJ. 2003;327(7414):557-560.", url: "https://doi.org/10.1136/bmj.327.7414.557" },
  { id: 18, kind: "As cited in the manuscript; not independently re-verified.", text: "Balshem H, Helfand M, Schünemann HJ, Oxman AD, Kunz R, Brozek J, Vist GE, Falck-Ytter Y, Meerpohl J, Norris S, Guyatt GH. GRADE guidelines: 3. Rating the quality of evidence. J Clin Epidemiol. 2011;64(4):401-406.", url: "https://doi.org/10.1016/j.jclinepi.2010.07.015" },
  { id: 19, kind: "As cited in the manuscript; not independently re-verified.", text: "Guyatt GH, Oxman AD, Kunz R, Brozek J, Alonso-Coello P, Rind D, Devereaux PJ, Montori VM, Freyschuss B, Vist G, Jaeschke R, Williams JW Jr, Murad MH, Sinclair D, Falck-Ytter Y, Meerpohl J, Whittington C, Thorlund K, Andrews J, Schünemann HJ. GRADE guidelines 6. Rating the quality of evidence - imprecision. J Clin Epidemiol. 2011;64(12):1283-1293.", url: "https://doi.org/10.1016/j.jclinepi.2011.01.012" },
  { id: 20, kind: "As cited in the manuscript; not independently re-verified.", text: "Norman GR, Sloan JA, Wyrwich KW. Interpretation of changes in health-related quality of life: the remarkable universality of half a standard deviation. Med Care. 2003;41(5):582-592.", url: "https://doi.org/10.1097/01.MLR.0000062554.74615.4C" },
  { id: 21, kind: "As cited in the manuscript; not independently re-verified.", text: "Carson-Chahhoud KV, Wakai A, van Agteren JEM, Smith BJ, McCabe G, Brinn MP, O'Sullivan R. Simple aspiration versus intercostal tube drainage for primary spontaneous pneumothorax in adults. Cochrane Database Syst Rev. 2017;9(9):CD004479.", url: "https://doi.org/10.1002/14651858.CD004479.pub3" },
  { id: 22, kind: "As cited in the manuscript; not independently re-verified.", text: "Zhu P, Xia H, Sun Z, Zhu D, Deng L, Zhang Y, Zhang H, Wang D. Manual aspiration versus chest tube drainage in primary spontaneous pneumothorax without underlying lung diseases: a meta-analysis of randomized controlled trials. Interact Cardiovasc Thorac Surg. 2019;28(6):936-944.", url: "https://doi.org/10.1093/icvts/ivy342" },
  { id: 23, kind: "As cited in the manuscript; not independently re-verified.", text: "Mohamed MMG, Patolia S, Nayak R. Needle aspiration versus tube thoracostomy in patients with symptomatic primary spontaneous pneumothorax: an updated meta-analysis of randomized controlled trials. J Thorac Dis. 2024;16(6):4011-4015.", url: "https://doi.org/10.21037/jtd-24-60" },
  { id: 24, kind: "As cited in the manuscript; not independently re-verified.", text: "Devanand A, Koh MS, Ong TH, Low SY, Phua GC, Tan KL, Philip Eng CT, Samuel M. Simple aspiration versus chest-tube insertion in the management of primary spontaneous pneumothorax: a systematic review. Respir Med. 2004;98(7):579-590.", url: "https://doi.org/10.1016/j.rmed.2004.04.006" },
  { id: 25, kind: "As cited in the manuscript; not independently re-verified.", text: "Bruschettini M, Romantsik O, Zappettini S, O'Donnell CP, Calevo MG. Needle aspiration versus intercostal tube drainage for pneumothorax in the newborn. Cochrane Database Syst Rev. 2019;2(2):CD011724.", url: "https://doi.org/10.1002/14651858.CD011724.pub3" },
  { id: 26, kind: "As cited in the manuscript; not independently re-verified.", text: "Noppen M, Alexander P, Driesen P, Slabbynck H, Verstraeten A. Manual aspiration versus chest tube drainage in first episodes of primary spontaneous pneumothorax: a multicenter, prospective, randomized pilot study. Am J Respir Crit Care Med. 2002;165(9):1240-1244.", url: "https://doi.org/10.1164/rccm.200111-078OC" },
  { id: 27, kind: "As cited in the manuscript; not independently re-verified.", text: "Ayed AK, Chandrasekaran C, Sukumar M. Aspiration versus tube drainage in primary spontaneous pneumothorax: a randomised study. Eur Respir J. 2006;27(3):477-482.", url: "https://doi.org/10.1183/09031936.06.00091505" },
  { id: 28, kind: "As cited in the manuscript; not independently re-verified.", text: "Ho KK, Ong ME, Koh MS, Wong E, Raghuram J. A randomized controlled trial comparing minichest tube and needle aspiration in outpatient management of primary spontaneous pneumothorax. Am J Emerg Med. 2011;29(9):1152-1157.", url: "https://doi.org/10.1016/j.ajem.2010.05.017" },
  { id: 29, kind: "As cited in the manuscript; not independently re-verified.", text: "Parlak M, Uil SM, van den Berg JWK. A prospective, randomised trial of pneumothorax therapy: manual aspiration versus conventional chest tube drainage. Respir Med. 2012;106(11):1600-1605.", url: "https://doi.org/10.1016/j.rmed.2012.08.005" },
  { id: 30, kind: "As cited in the manuscript; not independently re-verified.", text: "Thelle A, Gjerdevik M, SueChu M, Hagen OM, Bakke P. Randomised comparison of needle aspiration and chest tube drainage in spontaneous pneumothorax. Eur Respir J. 2017;49(4):1601296.", url: "https://doi.org/10.1183/13993003.01296-2016" },
  { id: 31, kind: "As cited in the manuscript; not independently re-verified.", text: "Ramouz A, Lashkari MH, Fakour S, Rasihashemi SZ. Randomized controlled trial on the comparison of chest tube drainage and needle aspiration in the treatment of primary spontaneous pneumothorax. Pak J Med Sci. 2018;34(6):1369-1374.", url: "https://doi.org/10.12669/pjms.346.16126" },
  { id: 32, kind: "As cited in the manuscript; not independently re-verified.", text: "Marx T, Joly LM, Parmentier AL, Pretalli JB, Puyraveau M, Meurice JC, Schmidt J, Tiffet O, Ferretti G, Lauque D, Honnart D, Ricard-Hibon A, Chouihed T, Vermylen C, Ould-Ahmed K, Guibert T, Hervé C, Ravaud P, Piton G, Capellier G. Simple aspiration versus drainage for complete pneumothorax: a randomized noninferiority trial. Am J Respir Crit Care Med. 2023;207(11):1475-1485.", url: "https://doi.org/10.1164/rccm.202110-2409OC" },
  { id: 33, kind: "As cited in the manuscript; not independently re-verified.", text: "Hallifax RJ, Yousuf A, Jones HE, Corcoran JP, Psallidas I, Rahman NM. Effectiveness of chemical pleurodesis in spontaneous pneumothorax recurrence prevention: a systematic review. Thorax. 2017;72(12):1121-1131.", url: "https://doi.org/10.1136/thoraxjnl-2015-207967" },
  { id: 34, kind: "As cited in the manuscript; not independently re-verified.", text: "Vilkki VA, Kytö V, Vilkki V, Gunn JM. Retreatment after primary spontaneous pneumothoraces managed with primary tube thoracostomy or surgery. Scand J Surg. 2024;113(2):160-165.", url: "https://doi.org/10.1177/14574969241242316" },
  { id: 35, kind: "As cited in the manuscript; not independently re-verified.", text: "Engwall-Gill AJ, Morgan K, Weller JH, Gomez-Quevedo O, Bonitto S, DeRosa J, Duron V, Feng C, Lovvorn HN 3rd, Kunisaki SM, Paquette J, Patel A, Russell RT, Scholz S, Sferra SR, Snyder C, Vimalathas P, Wu YS, Nasr IW. Risks for recurrence after pediatric primary spontaneous pneumothorax: results from a multicenter study. J Surg Res. 2026;324:287-294.", url: "https://doi.org/10.1016/j.jss.2026.03.104" },
  { id: 36, kind: "As cited in the manuscript; not independently re-verified.", text: "Chen JS, Chan WK, Tsai KT, Hsu HH, Lin CY, Yuan A, Chen WJ, Lai HS, Yang PC. Simple aspiration and drainage and intrapleural minocycline pleurodesis versus simple aspiration and drainage for the initial treatment of primary spontaneous pneumothorax: an open-label, parallel-group, prospective, randomised, controlled trial. Lancet. 2013;381(9874):1277-1282.", url: "https://doi.org/10.1016/S0140-6736(12)62170-9" },
  { id: 37, kind: "As cited in the manuscript; not independently re-verified.", text: "Walker S, Taylor E, McAndrew A, Carlton E, Chaudhuri E, Ghorpade P, Goodwin C, Connors J, Cook H, Luengo-Fernandez R, Creanor S, Maskell NA. Pragmatic non-inferiority randomised trial investigating needle aspiration versus chest drain for secondary spontaneous pneumothorax (the PRINCE-SSP study): study protocol for a randomised non-inferiority trial. BMJ Open. 2024;14(12):e093700.", url: "https://doi.org/10.1136/bmjopen-2024-093700" },
  { id: 38, kind: "As cited in the manuscript; not independently re-verified.", text: "Lopez E, Sahni R, Cooper M, Shalaby M. Serratus anterior plane block for procedural anesthesia for pigtail tube thoracostomy: a case series. Clin Pract Cases Emerg Med. 2025;9(1):5-9.", url: "https://doi.org/10.5811/cpcem.21251" },
  { id: 39, kind: "As cited in the manuscript; not independently re-verified.", text: "Reeves MT. Thoracic paravertebral block for tube thoracostomy analgesia in the emergency department: a case report. Clin Pract Cases Emerg Med. 2025;9(3):334-339.", url: "https://doi.org/10.5811/cpcem.47070" },
  { id: 40, kind: "As cited in the manuscript; not independently re-verified.", text: "Gowrinath K, Reddy SPK, Jyothi P. Severe localized re-expansion pulmonary oedema: an unusual instance. Natl Med J India. 2023;36(5):310-311.", url: "https://doi.org/10.25259/NMJI_838_20" },
  { id: 41, kind: "As cited in the manuscript; not independently re-verified.", text: "Fiallo P, Patel H, Devanathan NG, Yadav S, Biglione A. Transient Horner's syndrome: an unusual complication of pneumothorax treatment. Cureus. 2024;16(2):e55033.", url: "https://doi.org/10.7759/cureus.55033" },
  { id: 42, kind: "As cited in the manuscript; not independently re-verified.", text: "MacDonald AG, Long B. What is the utility of antibiotic prophylaxis in adult trauma patients with hemothorax or pneumothorax who undergo tube thoracostomy? Ann Emerg Med. 2023;82(5):624-626.", url: "https://doi.org/10.1016/j.annemergmed.2023.03.012" },
  { id: 43, kind: "As cited in the manuscript; not independently re-verified.", text: "Chang SH, Kang YN, Chiu HY, Chiu YH. A systematic review and meta-analysis comparing pigtail catheter and chest tube as the initial treatment for pneumothorax. Chest. 2018;153(5):1201-1212.", url: "https://doi.org/10.1016/j.chest.2018.01.048" },
  { id: 44, kind: "As cited in the manuscript; not independently re-verified.", text: "Johnson EH, Lee JS, Clement LP, Brockman V, Schmoekel N, Schroeppel TJ. The size paradox: an analysis of tube thoracostomy in trauma. Am J Surg. 2024;238:115829.", url: "https://doi.org/10.1016/j.amjsurg.2024.115829" },
  { id: 45, kind: "As cited in the manuscript; not independently re-verified.", text: "Messa GE, Fontenot CJ, Deville PE, Hunt JP, Marr AB, Schoen JE, Stuke LE, Greiffenstein PP, Smith AA. Chest tube size selection: evaluating provider practices, treatment efficacy, and complications in management of thoracic trauma. Am Surg. 2024;90(6):1501-1507.", url: "https://doi.org/10.1177/00031348241241735" },
  { id: 46, kind: "As cited in the manuscript; not independently re-verified.", text: "Ravikumar S. Re: small versus large bore chest tube in traumatic hemothorax, hemopneumothorax, and pneumothorax - external validity, endpoint heterogeneity, and trial sequential analysis assumptions. World J Emerg Surg. 2026;21(1):2.", url: "https://doi.org/10.1186/s13017-025-00669-5" },
  { id: 47, kind: "As cited in the manuscript; not independently re-verified.", text: "Hallifax R, Laskawiec-Szkonter M, Dobson M, Gerry S, Miller RF, Harvey JE, Rahman NM. Randomised Ambulatory Management of Primary Pneumothorax (RAMPP): protocol of an open-label, randomised controlled trial. BMJ Open Respir Res. 2019;6(1):e000403.", url: "https://doi.org/10.1136/bmjresp-2019-000403" },
  { id: 48, kind: "As cited in the manuscript; not independently re-verified.", text: "Shaban A, Zaki HA, Ponappan B, Malik WA, Shaban EE, Shaban A, Abosamak MF. Comparative effectiveness of suction versus water seal following tube thoracostomy in traumatic pneumothorax and hemothorax: an updated systematic review and meta-analysis. Am J Emerg Med. 2026;109:250-258.", url: "https://doi.org/10.1016/j.ajem.2026.07.055" },
  { id: 49, kind: "As cited in the manuscript; not independently re-verified.", text: "Arora D, Choudhary IS, Dutt A, Banerjee N, Chauhan AS, Rodha MS, Sharma N, Puranik AK, Chauhan NK, Gupta MK, Chaudhary R. Efficacy of slow negative pleural suction in thoracic trauma patients undergoing tube thoracostomy - a randomised clinical trial. Injury. 2025;56(1):111928.", url: "https://doi.org/10.1016/j.injury.2024.111928" },
  { id: 50, kind: "As cited in the manuscript; not independently re-verified.", text: "Ashby M, Haug G, Mulcahy P, Ogden KJ, Jensen O, Walters JA. Conservative versus interventional management for primary spontaneous pneumothorax in adults. Cochrane Database Syst Rev. 2014;2014(12):CD010565.", url: "https://doi.org/10.1002/14651858.CD010565.pub2" },
  { id: 51, kind: "As cited in the manuscript; not independently re-verified.", text: "Degirmenci M. Morbidity, mortality, and surgical treatment of secondary spontaneous pneumothorax. Ulus Travma Acil Cerrahi Derg. 2023;29(8):909-919.", url: "https://doi.org/10.14744/tjtes.2023.20566" },
  { id: 52, kind: "As cited in the manuscript; not independently re-verified.", text: "Ozalp T, Karapinar K. Is there a change in the view of treatment for primary spontaneous pneumothorax? The effect of thoracic CT and autologous blood pleurodesis: a retrospective cohort study. Medicine (Baltimore). 2024;103(26):e38639.", url: "https://doi.org/10.1097/MD.0000000000038639" },
  { id: 53, kind: "As cited in the manuscript; not independently re-verified.", text: "Okada K, Maki Y, Matsubara K, Hirano Y, Fujiwara T, Matsuura M. Spontaneous bilateral pneumothorax in a patient with anorexia nervosa: the management of prolonged postoperative air leakage. Acta Med Okayama. 2024;78(3):281-284.", url: "https://doi.org/10.18926/AMO/67203" },
  { id: 54, kind: "As cited in the manuscript; not independently re-verified.", text: "Greene AC, Schaefer EW, Ziegler O, Lucas DJ, Speck KE, Baerg JE, St Peter SD, Ricca RL, Kulaylat AN. Surgical management patterns for spontaneous pneumothorax in adolescents and young adults. Surgery. 2025;187:109644.", url: "https://doi.org/10.1016/j.surg.2025.109644" },
  { id: 55, kind: "As cited in the manuscript; not independently re-verified.", text: "Sahin C, Ayyildiz HNK, Mirapoglu S, Guvenc FT, Akis Yildiz Z, Arpacik M, Kaymakci A, Ilce Z. Use of video-assisted thoracoscopic surgery (VATS) in the treatment of primary spontaneous pneumothorax (PSP) in children. Cureus. 2023;15(7):e42624.", url: "https://doi.org/10.7759/cureus.42624" },
  { id: 56, kind: "As cited in the manuscript; not independently re-verified.", text: "Sarac F, Yazici M, Kuzdan MO. Approach to primary spontaneous pneumothorax: experiences of a new pediatric surgery clinic. Heliyon. 2024;10(17):e36732.", url: "https://doi.org/10.1016/j.heliyon.2024.e36732" },
  { id: 57, kind: "As cited in the manuscript; not independently re-verified.", text: "Topaloglu O, Turut H, Senturk Topaloglu E, Gumus A, Sevilgen G. The adjunctive role of dynamic systemic inflammation-based biomarkers in surgical risk stratification of first-episode primary spontaneous pneumothorax. Diagnostics (Basel). 2026;16(8):1141.", url: "https://doi.org/10.3390/diagnostics16081141" },
  { id: 58, kind: "As cited in the manuscript; not independently re-verified.", text: "Mendoza LN, Mayer W, Loomis M. Recurrent primary spontaneous pneumothorax in an 18-year-old man: a case report and review of considerations for prophylactic contralateral pleurodesis. Cureus. 2026;18(6):e110257.", url: "https://doi.org/10.7759/cureus.110257" },
  { id: 59, kind: "As cited in the manuscript; not independently re-verified.", text: "Alrajab S, Youssef AM, Akkus NI, Caldito G. Pleural ultrasonography versus chest radiography for the diagnosis of pneumothorax: review of the literature and meta-analysis. Crit Care. 2013;17(5):R208.", url: "https://doi.org/10.1186/cc13016" },
  { id: 60, kind: "As cited in the manuscript; not independently re-verified.", text: "Chan KK, Joo DA, McRae AD, Takwoingi Y, Premji ZA, Lang E, Wakai A. Chest ultrasonography versus supine chest radiography for diagnosis of pneumothorax in trauma patients in the emergency department. Cochrane Database Syst Rev. 2020;7(7):CD013031.", url: "https://doi.org/10.1002/14651858.CD013031.pub2" },
  { id: 61, kind: "As cited in the manuscript; not independently re-verified.", text: "Alavi M, Ali W, Sagar A, Shafiq M, Azhar M, Ali AS, Salahuddin M. Real-world effectiveness and safety of handheld ultrasound in pleural procedures. Monaldi Arch Chest Dis. 2025;95(4).", url: "https://doi.org/10.4081/monaldi.2024.2992" },
  { id: 62, kind: "As cited in the manuscript; not independently re-verified.", text: "Oh SN, Yang H, Lee CK, Park SH, Han CH, Heo H, Kim YS. Impact of deep learning-based computer-aided detection and electronic notification system for pneumothorax on time to treatment: clinical implementation. J Am Coll Radiol. 2025;22(4):471-477.", url: "https://doi.org/10.1016/j.jacr.2024.11.009" },
  { id: 63, kind: "As cited in the manuscript; not independently re-verified.", text: "Tatar OC, Akay MA, Metin S. DraiNet: AI-driven decision support in pneumothorax and pleural effusion management. Pediatr Surg Int. 2023;40(1):30.", url: "https://doi.org/10.1007/s00383-023-05609-5" },
  { id: 64, kind: "As cited in the manuscript; not independently re-verified.", text: "Akay MA, Tatar OC, Tatar E, Tagman BN, Metin S, Varlikli O. XRAInet: AI-based decision support for pneumothorax and pleural effusion management. Pediatr Pulmonol. 2024;59(11):2809-2814.", url: "https://doi.org/10.1002/ppul.27133" },
  { id: 65, kind: "As cited in the manuscript; not independently re-verified.", text: "Gunsoy E, Aykut A, Yildirim C, Oncul MV, Turkoglu S. Chest X-ray evaluation using GPT for tube thoracostomy or conservative care in non-tension spontaneous pneumothorax. Scand J Trauma Resusc Emerg Med. 2026;34(1):94.", url: "https://doi.org/10.1186/s13049-026-01616-2" },
  { id: 66, kind: "As cited in the manuscript; not independently re-verified.", text: "Rasheed FA, Brackenrich MD. Atypical spontaneous pneumothorax in an older obese female: a case report. Cureus. 2026;18(6):e110053.", url: "https://doi.org/10.7759/cureus.110053" },
  { id: 67, kind: "As cited in the manuscript; not independently re-verified.", text: "Aldemir H. Spontaneous pneumothorax precipitated by a forceful sneeze in a young male: a case report. Cureus. 2026;18(3):e104902.", url: "https://doi.org/10.7759/cureus.104902" },
  { id: 68, kind: "As cited in the manuscript; not independently re-verified.", text: "Solanki KK, Shook M, Yorke J, Vanlandingham A. A rare case of catamenial pneumothorax and a review of the current literature. Cureus. 2023;15(7):e42006.", url: "https://doi.org/10.7759/cureus.42006" },
  { id: 69, kind: "As cited in the manuscript; not independently re-verified.", text: "Sahagian M, Ahmad MS, Colon SS, Lafaro R. Spontaneous hemopneumothorax: a rare but life-threatening emergency. Cureus. 2025;17(5):e84641.", url: "https://doi.org/10.7759/cureus.84641" },
  { id: 70, kind: "As cited in the manuscript; not independently re-verified.", text: "Susai CJ, Hung YY, Burapachaisri K, Marquez A, Ramalingam N, Velotta JB. Pneumothorax in COVID-19: a negative prognostic indicator for in-hospital mortality. J Surg Res. 2026;321:323-332.", url: "https://doi.org/10.1016/j.jss.2026.01.026" },
  { id: 71, kind: "As cited in the manuscript; not independently re-verified.", text: "Turan YB. Risk factors affecting the development of pneumothorax in patients followed up in intensive care with a diagnosis of COVID-19. BMC Infect Dis. 2024;24(1):1243.", url: "https://doi.org/10.1186/s12879-024-10147-z" },
  { id: 72, kind: "As cited in the manuscript; not independently re-verified.", text: "Bautista ER, Gagto JO, Lukban FS, Querol RILC, Garcia CMH, Manapat AE. Outcomes of tube thoracostomies in COVID-19 patients: a retrospective cohort study in the University of the Philippines - Philippine General Hospital COVID-19 referral center. Acta Med Philipp. 2024;58(10):74-81.", url: "https://doi.org/10.47895/amp.vi0.7240" },
  { id: 73, kind: "As cited in the manuscript; not independently re-verified.", text: "Laverty RB, Ivins-O'Keefe KM, Adams AM, Flatley MJ, Sobieszczyk MJ, Mason PE, Sams VG. Tube thoracostomy complications in patients with ARDS requiring ECMO: worse in COVID-19 patients? Mil Med. 2024;189(5-6):e1016-e1022.", url: "https://doi.org/10.1093/milmed/usad454" },
  { id: 74, kind: "As cited in the manuscript; not independently re-verified.", text: "Harrison M. Non-invasive management of blunt traumatic pneumothorax - a meta-analysis. Emerg Med Australas. 2025;37(6):e70164.", url: "https://doi.org/10.1111/1742-6723.70164" },
  { id: 75, kind: "As cited in the manuscript; not independently re-verified.", text: "Duman S, Kassim R, Erdogdu E, Ercan LD, Gok AFK, Ozkan B, Ilhan M, Kara M, Ertekin C. Management of minimal pneumothorax in penetrating chest trauma: is observation safe? Ulus Travma Acil Cerrahi Derg. 2025;31(10):966-970.", url: "https://doi.org/10.14744/tjtes.2025.40552" },
  { id: 76, kind: "As cited in the manuscript; not independently re-verified.", text: "Yalcin NC, Ozkaya M. Predicting the need for tube thoracostomy in blunt trauma patients with occult pneumothorax: observation versus intervention. Interdiscip Cardiovasc Thorac Surg. 2025;40(11):ivaf250.", url: "https://doi.org/10.1093/icvts/ivaf250" },
  { id: 77, kind: "As cited in the manuscript; not independently re-verified.", text: "Srinivas S, Henderson K, Bergus KC, Jacobs A, Baselice H, Donnelly E, Valdez C, Tracy BM, Coleman JR. Using chest X-ray to predict tube thoracostomy in traumatic pneumothorax: a single-institution retrospective review. J Trauma Acute Care Surg. 2024;97(1):82-89.", url: "https://doi.org/10.1097/TA.0000000000004314" },
  { id: 78, kind: "As cited in the manuscript; not independently re-verified.", text: "Al Tannir AH, Tentis M, Maring M, Patin B, Biesboer EA, Golestani S, Pokrzywa CJ, Peschman J, Murphy PB, Morris RS, Carver TW, de Moya MA. Can concurrent traumatic hemopneumothorax be safely observed? J Surg Res. 2024;304:400-407.", url: "https://doi.org/10.1016/j.jss.2024.09.085" },
  { id: 79, kind: "As cited in the manuscript; not independently re-verified.", text: "Lewis MR, Georgoff P. Minimally invasive management of thoracic trauma: current evidence and guidelines. Trauma Surg Acute Care Open. 2024;9(Suppl 2):e001372.", url: "https://doi.org/10.1136/tsaco-2024-001372" },
  { id: 80, kind: "As cited in the manuscript; not independently re-verified.", text: "Blank JJ, de Moya MA. Traumatic pneumothorax and hemothorax: what you need to know. J Trauma Acute Care Surg. 2026;100(1):12-17.", url: "https://doi.org/10.1097/TA.0000000000004692" }
];

const NODES = [
  {
    id: "entry",
    type: "start",
    label: "Suspected spontaneous pneumothorax",
    sub: "Confirm on chest radiograph, CT or thoracic ultrasound",
    meaning: "Initial diagnostic confirmation of suspected spontaneous pneumothorax (air in the pleural space without trauma or iatrogenic instrumentation) via imaging, and localisation of a safe site if pleural intervention turns out to be needed.",
    rationale: "Because contemporary management rests on symptoms and high-risk characteristics rather than radiographic pneumothorax size, imaging's main role here is confirming the diagnosis and finding a safe procedural site, not triggering drainage on size alone. Thoracic ultrasonography is more sensitive than supine chest radiography with comparable specificity in trauma and critical-care populations, and handheld ultrasound is effective and safe for guiding pleural procedures. Automated deep-learning detection/notification, AI triage models predicting need for tube thoracostomy, and large-language-model chest radiograph evaluation all exist but remain unvalidated for autonomous clinical use.",
    cautions: [
      "CT is listed here and expanded in the figure's own caption (\"CT, computed tomography\"), but the manuscript prose never discusses the diagnostic role, indications or accuracy of CT for confirming suspected spontaneous pneumothorax — not stated in the manuscript."
    ],
    refs: [59, 60, 61, 62, 63, 64, 65]
  },
  {
    id: "tension-decision",
    type: "decision",
    label: "Tension physiology or",
    sub: "haemodynamic instability?",
    meaning: "Immediate clinical triage for life-threatening tension pneumothorax physiology or haemodynamic compromise, before any conservative, aspiration or ambulatory pathway is even considered. Tension pneumothorax was itself excluded from the systematic review's primary RCT comparison of aspiration versus tube thoracostomy.",
    rationale: "Tension physiology or haemodynamic instability makes immediate pleural evacuation obligatory rather than discretionary; every aspiration-first or conservative strategy in this algorithm applies only to haemodynamically stable patients.",
    cautions: [
      "No numeric blood pressure, heart rate or shock-index cutoff for \"instability\" is given in the figure or anywhere in the manuscript text — not stated in the manuscript."
    ],
    refs: [1, 2]
  },
  {
    id: "immediate-rec",
    type: "action",
    label: "IMMEDIATE",
    sub: "needle decompression, then tube thoracostomy",
    meaning: "Urgent needle decompression to relieve tension physiology/instability, followed by definitive insertion of an indwelling intercostal drain (tube thoracostomy) connected to an underwater-seal/drainage system.",
    rationale: "Tension physiology or haemodynamic instability mandates immediate decompression and continuous pleural evacuation via tube thoracostomy.",
    cautions: [
      "Needle gauge, the anatomical landmark used for tension decompression, and the subsequent tube's French size are not stated anywhere in the manuscript.",
      "This box has no further arrow in the figure connecting it to drain-care, persistent-air-leak assessment or recurrence prevention, even though these patients go on to standard tube drainage like any other drained patient."
    ],
    refs: [1, 2]
  },
  {
    id: "highrisk-decision",
    type: "decision",
    label: "Any high-risk",
    sub: "characteristic?",
    meaning: "Screens haemodynamically stable patients for clinical or physiological high-risk features — established or presumed secondary spontaneous pneumothorax (SSP), bilateral involvement, blood in the pleural space, significant hypoxia, or positive-pressure ventilation — that rule out conservative observation or simple needle aspiration as the default therapy.",
    rationale: "Patients with underlying parenchymal pathology (COPD, interstitial lung disease, cystic fibrosis, opportunistic infection) have limited physiological reserve, tolerate pleural air poorly, and account for nearly all in-hospital spontaneous-pneumothorax mortality. Significant hypoxia and bilateral pneumothorax are BTS guideline high-risk features requiring procedural drainage rather than symptom-led observation. Spontaneous haemopneumothorax is described as \"a surgical emergency in which the balance of considerations shifts decisively towards immediate drainage and operative exploration.\" Positive-pressure ventilation and impaired physiological reserve (ICU, COVID-19, ARDS/ECMO settings) sharply reverse the risk-benefit calculus away from minimally invasive or conservative care and toward tube thoracostomy.",
    cautions: [
      "Figure-vs-text gap: in the figure, haemopneumothorax routes via \"Yes\" to the small-bore tube-thoracostomy box, but the manuscript's own text frames spontaneous haemopneumothorax as a surgical emergency favouring immediate drainage *and* operative exploration — small-bore preference isn't specifically endorsed there for this subgroup."
    ],
    refs: [1, 2, 6, 30, 37, 51, 69, 70, 71, 72, 73]
  },
  {
    id: "highrisk-list",
    type: "reference",
    label: "High-risk characteristics",
    sub: "Significant hypoxia · Bilateral pneumothorax · Underlying lung disease (SSP) · Haemopneumothorax · Age >50 with smoking history · Positive pressure ventilation",
    meaning: "The defining list of \"high-risk\" features referred to by the decision box it's attached to.",
    rationale: "Underlying lung disease (SSP) and age over 50 with a smoking history: patients with limited physiological reserve account for nearly all in-hospital spontaneous-pneumothorax mortality, although one RCT subgroup of 48 SSP patients showed shorter hospital stay with aspiration and a dedicated non-inferiority trial (PRINCE-SSP) is still ongoing — current guidance nonetheless continues to favour tube drainage as the provisional default in SSP. Significant hypoxia and bilateral pneumothorax are listed BTS guideline high-risk features. Haemopneumothorax is treated as a surgical emergency. Positive-pressure ventilation and impaired physiological reserve reverse the risk-benefit calculus toward drainage.",
    cautions: [
      "\"Age >50 with smoking history\" is explicitly attributed in the manuscript to the British Thoracic Society guideline — not derived from the review's own RCT synthesis — and its wording there (\"age above 50 with a significant smoking history\") differs slightly from the figure; no pack-year cut-off is given anywhere."
    ],
    refs: [1, 2, 6, 30, 37, 51, 69, 70, 71, 72, 73]
  },
  {
    id: "tube-thoracostomy-rec",
    type: "action",
    label: "Tube thoracostomy",
    sub: "(small-bore 8–14 F preferred) · Admit",
    meaning: "Insertion of an indwelling intercostal catheter or chest drain connected to an underwater-seal drainage system, preferring a smaller-calibre drain over a traditional large-bore tube, together with inpatient hospital admission.",
    rationale: "Tube thoracostomy provides continuous air evacuation during ongoing air leak and higher immediate re-expansion reliability (risk ratio 0.78, 95% CI 0.69–0.89 favouring drainage; number needed to treat ≈ 7), prioritised when physiological reserve is low or high-risk features exist. Small-bore/pigtail catheters achieve comparable success to large-bore chest tubes (79.84% vs 82.87%, RR 0.99, 95% CI 0.93–1.05, no meaningful heterogeneity across 11 studies / 875 patients) with significantly lower complication rates in spontaneous pneumothorax. Indwelling underwater-seal tube thoracostomy mandates hospital admission (100% admission in one pilot trial).",
    cautions: [
      "The exact \"8–14 F\" gauge range appears only in the figure and is never stated anywhere in the manuscript text or tables — it reflects external pleural-guideline convention rather than the review's own synthesis."
    ],
    refs: [1, 2, 8, 21, 26, 43, 51, 44, 45, 46]
  },
  {
    id: "symptomatic-decision",
    type: "decision",
    label: "Symptomatic?",
    sub: "(breathlessness, chest pain limiting activity)",
    meaning: "Decouples intervention from radiographic pneumothorax size in low-risk, haemodynamically stable primary spontaneous pneumothorax, basing the decision to intervene on whether the patient has clinically limiting symptoms rather than being asymptomatic or minimally symptomatic.",
    rationale: "Both the 2023 BTS guideline and the 2024 joint ERS/EACTS/ESTS guideline — informed by a conservative-management RCT and an ambulatory-management trial — shifted management away from radiographic size cut-offs toward symptom-driven care, because most minimally symptomatic or uncomplicated primary spontaneous pneumothorax episodes resolve without pleural instrumentation.",
    cautions: [
      "The exact parenthetical \"(breathlessness, chest pain limiting activity)\" appears only in the figure; those words do not appear anywhere in the manuscript body."
    ],
    refs: [1, 2, 11, 12, 13, 14]
  },
  {
    id: "conservative-rec",
    type: "action",
    label: "CONSERVATIVE CARE",
    sub: "Observation regardless of size · Supplemental oxygen if indicated · Review at 2–4 days",
    meaning: "Watchful waiting — non-interventional outpatient or observational management without pleural aspiration or drainage — irrespective of radiographic pneumothorax size, for asymptomatic or minimally symptomatic low-risk primary spontaneous pneumothorax.",
    rationale: "In one RCT of 316 patients with moderate-to-large primary spontaneous pneumothorax, 85% of the conservative arm (137 of 162 patients) needed no interventional procedure at all, with fewer serious adverse events and complete-case 8-week re-expansion of 94.4% vs 98.5% (within the pre-specified non-inferiority margin). A sensitivity analysis imputing outcomes missing after 56 days as failures widened that gap beyond the margin, which is why this evidence carries only Low GRADE certainty.",
    cautions: [
      "\"Supplemental oxygen if indicated\" is never mentioned anywhere in the manuscript prose — note also that significant hypoxia already routes to tube thoracostomy earlier in this algorithm, so this line applies to milder desaturation only.",
      "The \"Review at 2–4 days\" outpatient interval appears only in the figure (consistent with external BTS guideline practice) and is not stated anywhere in the manuscript text."
    ],
    refs: [1, 2, 12, 13, 50]
  },
  {
    id: "aspiration-rec",
    type: "action",
    label: "NEEDLE (SIMPLE) ASPIRATION",
    sub: "16–18 G cannula, 2nd ICS mid-clavicular or 5th ICS mid-axillary line · Aspirate to maximum 2.5 L",
    meaning: "Manual evacuation of pleural air through a small cannula or catheter that is withdrawn immediately at the end of the procedure, leaving no indwelling chest drain behind.",
    rationale: "Across randomised syntheses, tube thoracostomy achieves higher immediate re-expansion (RR 0.78, 95% CI 0.69–0.89 across 6 RCTs / 435 participants; Moderate certainty), but immediate success is a surrogate endpoint remediable by escalation without compromising later outcomes — success at one week (93% vs 85%) and at one year (26% vs 27.3% recurrence) do not differ. Aspiration shortens hospital length of stay by a pooled mean difference of −1.70 days (95% CI −2.36 to −1.04 across 5 RCTs / 358 participants), exceeding the pre-specified minimal clinically important difference of roughly 1.25–1.5 days. Aspiration also lowers hospital admission rates (52% vs 100% in one trial), causes less procedural pain, and produces fewer adverse events (Low certainty).",
    cautions: [
      "Cannula gauge (16–18 G), the anatomical insertion sites, and the \"2.5 L\" maximum aspirated volume are not stated anywhere in the manuscript prose or tables — all appear only in the figure, reflecting external BTS/ERS guideline technique.",
      "Figure-vs-text sequencing discrepancy: the manuscript's Abstract, Discussion and Graphical Abstract present \"needle aspiration or ambulatory small-bore drainage\" as parallel first-line alternatives, whereas this figure places needle aspiration strictly first, reaching ambulatory drainage only after a failed (and possibly repeated) aspiration attempt."
    ],
    refs: [1, 10, 11, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 37]
  },
  {
    id: "reexpansion-decision",
    type: "decision",
    label: "Lung re-expanded and",
    sub: "symptoms resolved at repeat imaging?",
    meaning: "Post-aspiration clinical and radiographic reassessment to determine immediate procedural success versus aspiration failure requiring a repeat attempt or escalation to drainage.",
    rationale: "Because needle aspiration has a higher immediate failure rate than tube thoracostomy — immediate success ranging from 54.2% to 69% across individual trials — this checkpoint identifies the subset requiring escalation while letting responders avoid admission and an indwelling drain altogether.",
    cautions: [
      "The timing of \"repeat imaging\" isn't specified in the figure, and the manuscript itself notes that constituent trials varied materially in how they defined adequate re-expansion (one trial used 24 hours)."
    ],
    refs: [21, 24, 26, 27, 28, 29, 30, 31, 32]
  },
  {
    id: "discharge-rec",
    type: "action",
    label: "DISCHARGE",
    sub: "Same-day, with written safety-netting advice · Review at 2–4 weeks",
    meaning: "Same-day outpatient discharge without hospital admission following successful aspiration, accompanied by written return precautions and scheduled outpatient follow-up.",
    rationale: "Avoiding hospital admission in roughly half of aspirated patients (48% avoided admission in one trial, where 52% required hospitalisation versus 100% with drainage; safe outpatient discharge was also shown in a separate trial) drives the clinically meaningful reduction in bed occupancy, cost and inpatient burden that aspiration offers over drainage.",
    cautions: [
      "\"With written safety-netting advice\" is not mentioned in the manuscript prose; the \"Review at 2–4 weeks\" follow-up window likewise appears only in the figure, reflecting external BTS guideline recommendation rather than the review's own data.",
      "This box has no visual arrow onward to recurrence-prevention criteria, even though discharged patients carry a roughly 26%–50% recurrence risk across the literature and may qualify for elective VATS consideration."
    ],
    refs: [26, 28, 1, 10, 12]
  },
  {
    id: "residual-decision",
    type: "decision",
    label: "First aspiration attempt",
    sub: "and residual volume small?",
    meaning: "Gates whether a single repeat (second) needle aspiration may be performed, versus escalating straight to ambulatory or standard small-bore drainage.",
    rationale: "The manuscript states plainly: \"In every trial in which aspiration failed, the remedy was a further aspiration attempt or the placement of a drain, an escalation that did not appear to compromise ultimate outcome.\"",
    cautions: [
      "Neither the cut-off for \"residual volume small\" nor the criteria for when a clinician should decline a second attempt are defined anywhere in the manuscript — not stated in the manuscript.",
      "After a genuine second attempt has already occurred, \"First aspiration attempt\" is by definition false, which is how the reassessment loop below resolves downward to ambulatory drainage rather than repeating indefinitely."
    ],
    refs: [21, 24]
  },
  {
    id: "second-attempt-rec",
    type: "action",
    label: "Second aspiration",
    sub: "attempt permissible (maximum of two)",
    meaning: "A single permitted repeat needle aspiration when the first attempt failed but the residual pneumothorax volume is judged small, followed by a return to clinical/imaging reassessment (the dashed \"Reassess\" arrow back to the re-expansion check above).",
    rationale: "Same citation as the gating decision above — the manuscript treats a further aspiration attempt as an escalation step that did not appear to compromise the ultimate outcome in any constituent trial.",
    cautions: [
      "The explicit numeric cap \"(maximum of two)\" is not separately discussed in the manuscript prose beyond \"a further aspiration attempt\" — it reflects external convention rather than a stopping rule derived from the review's own RCT data."
    ],
    refs: [21, 24]
  },
  {
    id: "ambulatory-rec",
    type: "action",
    label: "AMBULATORY SMALL-BORE DRAINAGE",
    sub: "8 F device with one-way valve, where a pneumothorax service with reliable follow-up exists; otherwise tube thoracostomy with admission",
    meaning: "Insertion of a small-bore pleural device incorporating a one-way valve, enabling continuous pleural air evacuation on an outpatient/ambulatory basis where structured follow-up infrastructure exists — or conventional inpatient small-bore tube thoracostomy with hospital admission where such a service is unavailable.",
    rationale: "Small-bore catheters occupy an intermediate position, delivering the security of continuous drainage during ongoing air leak at a tolerability closer to aspiration. In one open-label RCT of 236 symptomatic primary spontaneous pneumothorax patients across 24 UK hospitals, ambulatory management reduced median hospitalisation (including readmissions) from 4 days to 0 days and reduced further pleural procedures from 35% to 21%. A separate trial showed safe outpatient management using a minichest tube with a Heimlich valve, with equivalent pain, satisfaction and complication rates to needle aspiration. Both the 2023 BTS guideline and the 2024 joint ERS/EACTS/ESTS guideline endorse ambulatory management for suitable patients.",
    cautions: [
      "The exact \"8 F\" calibre and \"one-way valve\" phrasing, and the institutional-infrastructure condition (\"where a pneumothorax service with reliable follow-up exists\"), appear only in the figure and are not stated anywhere in the manuscript prose or tables.",
      "Carries the same aspiration-vs-ambulatory-drainage sequencing discrepancy flagged above: the manuscript text treats the two as co-equal first-line options, while this figure places ambulatory drainage strictly after a failed aspiration attempt."
    ],
    refs: [1, 12, 14, 28, 43, 47]
  },
  {
    id: "airleak-decision",
    type: "decision",
    label: "Persistent air leak >48 h",
    sub: "or failure to re-expand?",
    meaning: "Evaluation, at 48 hours, of patients managed with a pleural drain for ongoing bubbling/air leak or incomplete lung re-expansion.",
    rationale: "Persistent air leak — \"conventionally defined as continuing beyond 48 hours\" — substantially prolongs hospital admission and requires escalation of pleural or surgical management; the manuscript notes it is disproportionately a problem of secondary spontaneous pneumothorax.",
    cautions: [
      "In the figure, only the ambulatory/standard-drainage branch feeds into this checkpoint — no arrow arrives here from the high-risk tube-thoracostomy box or from the immediate-decompression box, even though the manuscript itself notes persistent air leak is disproportionately a secondary-disease problem (i.e., exactly the patients routed to that high-risk branch)."
    ],
    refs: [12, 33, 52, 53]
  },
  {
    id: "drain-removal-rec",
    type: "action",
    label: "Remove drain after",
    sub: "24 h without air leak · Confirm on imaging · Discharge",
    meaning: "Cessation of pleural drainage, radiographic confirmation of sustained lung expansion, drain removal and discharge once air leak has resolved within 48 hours and remained absent for 24 hours.",
    rationale: "Not discussed in the manuscript prose at all — the manuscript addresses overall hospital length of stay and immediate/1-week re-expansion, but never the protocol for timing chest-drain removal or post-removal imaging confirmation.",
    cautions: [
      "\"24 h without air leak\" and \"Confirm on imaging\" are figure-only details, never stated anywhere in the manuscript text or tables.",
      "Like the discharge box after successful aspiration, this box has no visual arrow onward to recurrence-prevention criteria, even though the same criteria logically apply to these patients too."
    ],
    refs: []
  },
  {
    id: "escalate-rec",
    type: "action",
    label: "ESCALATE — discuss with thoracic surgery",
    sub: "Thoracic suction · larger-bore drain · chemical or autologous blood pleurodesis · endobronchial valve · VATS bullectomy with pleurodesis",
    meaning: "Multidisciplinary escalation involving thoracic surgical consultation and selection among secondary pleural, bronchoscopic or operative interventions when air leak persists beyond 48 hours or the lung fails to re-expand.",
    rationale: "The manuscript lists exactly these modalities — thoracic suction, conversion to a larger-bore drain, chemical or autologous blood pleurodesis, endobronchial valves and surgery — while explicitly noting they are \"supported by evidence of limited quality\" and identified by the 2024 joint European guideline as a principal remaining evidence gap. Suction-versus-water-seal evidence comes from traumatic, not spontaneous, pneumothorax, and the manuscript explicitly cautions against extrapolating. Systematic-review recurrence rates after pleurodesis range from 0.0–3.2% (VATS talc) to 13.0–33.3% (tetracycline via chest drain) to 15.6–18.2% (autologous blood patch). Surgical management in secondary spontaneous pneumothorax carries a mortality of up to 5%.",
    cautions: [
      "No suction pressure setting, larger-bore French size, sclerosant dose, or blood-patch volume is stated anywhere in the figure or the manuscript text."
    ],
    refs: [12, 33, 52, 53, 48, 49, 51, 54, 55, 56]
  },
  {
    id: "recurrence-rec",
    type: "action",
    label: "RECURRENCE PREVENTION",
    sub: "Offer definitive VATS with pleurodesis after a second ipsilateral event, or after a first event where bleb burden, occupation or remoteness from care raise the consequences of recurrence",
    meaning: "Elective or semi-elective definitive surgical obliteration/scarification of the pleural space via video-assisted thoracoscopic surgery (VATS) with bullectomy and pleurodesis, to prevent future ipsilateral pneumothorax episodes.",
    rationale: "Recurrence is governed by underlying pleural biology rather than which device evacuated the first episode (26% vs 27.3% at one year in one trial; 26–50% after drainage alone across the wider literature; frequent five-year retreatment after tube thoracostomy alone; paediatric recurrence driven by older age, radiographic bleb burden and smoking rather than device choice). Only pleural-space obliteration reduces recurrence: VATS with bullectomy and pleurodesis is the definitive intervention, achieving recurrence rates below 5% in most series, with established safety and efficacy in adolescents, young adults and children. Dynamic inflammation-based biomarkers have been studied for first-episode surgical risk stratification, and the choice between operating after a first versus second episode depends on individualised assessment of bleb burden, occupational/recreational exposures and patient preference.",
    cautions: [
      "Wording differs between the figure (\"remoteness from care\", \"second ipsilateral event\", \"VATS with pleurodesis\") and the manuscript text (which instead lists \"recreational exposures\" and \"patient preference\", omitted from the figure, and writes \"VATS with bullectomy and pleurodesis\").",
      "The figure shows this box reached only via the escalation path for persistent air leak — but recurrence-prevention criteria logically apply just as much to patients who resolved via conservative care, successful aspiration, drain removal, or high-risk inpatient drainage; the figure draws no arrows from any of those boxes to this one."
    ],
    refs: [33, 34, 35, 36, 54, 55, 56, 57, 58]
  }
];

const GLOSSARY = [
  { match: "SSP", full: "secondary spontaneous pneumothorax", def: "Pneumothorax occurring in a patient with pre-existing lung disease (e.g. COPD, interstitial lung disease, cystic fibrosis) — carries poorer physiological reserve than primary spontaneous pneumothorax and is managed more cautiously throughout this algorithm." },
  { match: "PSP", full: "primary spontaneous pneumothorax", def: "Pneumothorax occurring without known underlying lung disease, trauma or iatrogenic instrumentation — the population in which this algorithm's symptom-led, size-independent approach is best supported." },
  { match: "spontaneous pneumothorax", full: "spontaneous pneumothorax", def: "Accumulation of air in the pleural space without trauma or iatrogenic instrumentation, occurring either without known lung disease (primary) or with it (secondary)." },
  { match: "ICS", full: "intercostal space", def: "The anatomical space between two ribs, used here to specify needle or catheter insertion sites (e.g. \"2nd ICS mid-clavicular\")." },
  { match: "VATS", full: "video-assisted thoracoscopic surgery", def: "A minimally invasive surgical technique using a thoracoscope and small incisions, used here for definitive bullectomy and pleurodesis to prevent recurrence." },
  { match: "RCT", full: "randomised controlled trial", def: "A study design in which participants are randomly assigned to different interventions to minimise bias when comparing outcomes." },
  { match: "RR", full: "risk ratio", def: "The ratio of the probability of an outcome in one group to the probability in another; a risk ratio below 1 here favours tube thoracostomy over aspiration for immediate success." },
  { match: "95% CI", full: "95% confidence interval", def: "The range within which the true effect size is expected to lie 95% of the time, given the study data; a confidence interval that excludes the null indicates a statistically significant finding." },
  { match: "NNT", full: "number needed to treat", def: "The number of patients who would need to receive the more effective treatment, instead of the comparator, for one additional patient to benefit." },
  { match: "MCID", full: "minimal clinically important difference", def: "The smallest change in an outcome that patients would perceive as beneficial — used here to judge whether a statistically significant difference (such as length of stay) is actually meaningful at the bedside." },
  { match: "GRADE", full: "Grading of Recommendations Assessment, Development and Evaluation", def: "A structured framework for rating the certainty of evidence for each outcome (High, Moderate, Low, or Very Low) based on risk of bias, imprecision, inconsistency and other factors." },
  { match: "RoB 2", full: "Cochrane Risk of Bias 2", def: "The revised Cochrane tool for assessing risk of bias in randomised trials across five domains (randomisation, deviations from intended interventions, missing data, outcome measurement, and selective reporting)." },
  { match: "ARD", full: "absolute risk difference", def: "The arithmetic difference between the event rates in two groups, expressed in percentage points rather than as a ratio." },
  { match: "BTS", full: "British Thoracic Society", def: "The UK professional body whose pleural disease guideline (2023, and earlier 2010 version) is cited repeatedly in this algorithm for high-risk thresholds and procedural technique details not derived from the review's own randomised evidence." },
  { match: "ERS", full: "European Respiratory Society", def: "The European professional body that co-authored (with EACTS and ESTS) the 2024 joint clinical practice guideline on adults with spontaneous pneumothorax cited throughout this algorithm." },
  { match: "Cohen's d", full: "Cohen's d", def: "A standardised effect-size measure expressing the difference between two group means in units of standard deviation; conventionally interpreted as small (0.2), medium (0.5) or large (0.8)." }
];

const AGENTS = [];
