# -*- coding: utf-8 -*-
"""
Full generation script for 100 General Studies Questions.
Modeled after authentic Testbook, UPSC Prelims, and State PSC (APSC CCE / Paper I) patterns.
"""
import json
import os

gs_questions = []

def add_gs(qNum, subject, topic, subtopic, stem, options, correct, explanation, formula=None, ref="NCERT / Standard Reference", diff="MEDIUM", year=2024):
    opt_objs = []
    for i, opt in enumerate(options):
        opt_objs.append({"id": chr(65 + i), "text": opt})
    
    gs_questions.append({
        "id": f"gs-q-{qNum:03d}",
        "questionNumber": qNum,
        "examId": "upsc-cse",
        "subject": subject,
        "topic": topic,
        "subtopic": subtopic,
        "stem": stem,
        "options": opt_objs,
        "correctOption": correct,
        "formulaContext": formula,
        "explanation": explanation,
        "referenceSource": ref,
        "difficulty": diff,
        "pyqYear": year,
        "pyqExam": f"Testbook Model / State PSC GS Paper I {year}"
    })

# --- INDIAN POLITY & CONSTITUTION (1 - 18) ---
add_gs(1, "Indian Polity & Constitution", "Preamble of the Constitution", "42nd Amendment Amendments",
    "Which of the following sets of words was added to the Preamble of the Indian Constitution by the 42nd Constitutional Amendment Act, 1976?",
    ["Socialist, Secular, and Integrity", "Sovereign, Democratic, and Republic", "Liberty, Equality, and Fraternity", "Justice, Liberty, and Dignity"],
    "A",
    "The 42nd Constitutional Amendment Act, 1976 amended the Preamble by adding three words: 'Socialist', 'Secular', and 'Integrity'. The Preamble has been amended only once in Indian constitutional history.",
    ref="Constitution of India, Preamble & 42nd Amendment Act", diff="EASY", year=2024)

add_gs(2, "Indian Polity & Constitution", "Fundamental Rights", "Article 21 & Right to Privacy",
    "In which landmark judgement did the Supreme Court of India unanimously declare the 'Right to Privacy' as a fundamental right under Article 21?",
    ["Justice K.S. Puttaswamy (Retd.) v. Union of India (2017)", "Maneka Gandhi v. Union of India (1978)", "Kesavananda Bharati v. State of Kerala (1973)", "A.K. Gopalan v. State of Madras (1950)"],
    "A",
    "In Justice K.S. Puttaswamy v. Union of India (2017), a nine-judge constitution bench unanimously ruled that the right to privacy is an intrinsic part of the right to life and personal liberty guaranteed under Article 21 of Part III of the Constitution.",
    ref="Supreme Court Judgement, 2017", diff="EASY", year=2023)

add_gs(3, "Indian Polity & Constitution", "Judiciary & Writs", "Writ Jurisdiction Comparison",
    "With reference to the writ jurisdiction of courts in India, which of the following statements is correct?",
    ["The writ jurisdiction of the High Court under Article 226 is wider than that of the Supreme Court under Article 32", "The Supreme Court can issue writs for legal rights other than fundamental rights", "High Courts can issue writs only for the enforcement of fundamental rights", "Writs can only be issued against government officials, never against tribunals"],
    "A",
    "Under Article 32, the Supreme Court can issue writs ONLY for the enforcement of Fundamental Rights. Under Article 226, High Courts can issue writs not only for Fundamental Rights but also 'for any other purpose' (ordinary legal rights). Hence the High Court's writ jurisdiction is wider in scope.",
    ref="Indian Polity by M. Laxmikanth, Chapter on Judiciary", diff="MEDIUM", year=2024)

add_gs(4, "Indian Polity & Constitution", "Directive Principles of State Policy", "Article 44 Uniform Civil Code",
    "Article 44 of the Directive Principles of State Policy (DPSP) in the Indian Constitution directs the State to secure for all citizens:",
    ["A Uniform Civil Code throughout the territory of India", "Organization of Village Panchayats", "Separation of judiciary from the executive", "Promotion of international peace and security"],
    "A",
    "Article 44 states: 'The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India.' Village Panchayats are under Article 40, separation of judiciary under Article 50, and international peace under Article 51.",
    ref="Constitution of India, Part IV (Article 44)", diff="EASY", year=2023)

add_gs(5, "Indian Polity & Constitution", "Fundamental Duties", "Swaran Singh Committee",
    "Fundamental Duties in Part IV-A (Article 51A) of the Constitution were incorporated upon the recommendation of which committee?",
    ["Swaran Singh Committee", "Sarkaria Commission", "Verma Committee", "Balwant Rai Mehta Committee"],
    "A",
    "The Sardar Swaran Singh Committee (1976) recommended the inclusion of Fundamental Duties. The 42nd Amendment Act added 10 duties in 1976, and the 86th Amendment Act in 2002 added the 11th duty (education for children aged 6-14).",
    ref="Constitution of India, Article 51A", diff="EASY", year=2022)

add_gs(6, "Indian Polity & Constitution", "Union Executive", "Impeachment of the President",
    "As per Article 61 of the Indian Constitution, the resolution for impeaching the President of India must be passed by what majority in each House of Parliament?",
    ["A majority of not less than two-thirds of the total membership of the House", "A majority of not less than two-thirds of members present and voting", "A simple majority of the total membership", "An absolute majority of members present and voting"],
    "A",
    "Article 61 specifies the most stringent majority requirement in the Indian Constitution: the impeachment resolution must be passed by a majority of not less than two-thirds of the TOTAL membership of the House (not just present and voting).",
    ref="Constitution of India, Article 61", diff="MEDIUM", year=2024)

add_gs(7, "Indian Polity & Constitution", "State Executive", "Governor's Ordinance Making Power",
    "Under which Article of the Indian Constitution is the Governor of a State empowered to promulgate ordinances during the recess of the State Legislature?",
    ["Article 213", "Article 123", "Article 163", "Article 161"],
    "A",
    "Article 213 empowers the Governor to promulgate ordinances when the state legislative assembly is not in session. Article 123 grants corresponding ordinance-making power to the President of India.",
    ref="Constitution of India, Article 213", diff="EASY", year=2023)

add_gs(8, "Indian Polity & Constitution", "Parliament", "Money Bill Procedure",
    "If a Money Bill passed by the Lok Sabha is transmitted to the Rajya Sabha, within how many days must the Rajya Sabha return it with or without recommendations?",
    ["14 days", "30 days", "60 days", "180 days (6 months)"],
    "A",
    "Under Article 109, the Rajya Sabha has restricted powers regarding Money Bills. It must return the Bill within 14 days. If not returned within 14 days, the Bill is deemed to have been passed by both Houses in the form passed by the Lok Sabha.",
    ref="Constitution of India, Article 109 & 110", diff="EASY", year=2024)

add_gs(9, "Indian Polity & Constitution", "Parliament", "Joint Sitting Provisions",
    "Who among the following presides over a Joint Sitting of both Houses of Parliament convened under Article 108?",
    ["Speaker of the Lok Sabha", "Chairman of the Rajya Sabha (Vice President)", "President of India", "Leader of the House in Lok Sabha"],
    "A",
    "Under Article 118(4), a joint sitting of Parliament is presided over by the Speaker of the Lok Sabha (or in their absence, the Deputy Speaker, or Deputy Chairman of Rajya Sabha). The Chairman of Rajya Sabha (Vice President) never presides because he is not a member of Parliament.",
    ref="Constitution of India, Article 108 & 118(4)", diff="MEDIUM", year=2022)

add_gs(10, "Indian Polity & Constitution", "Amendment of Constitution", "Article 368 Scope",
    "A constitutional amendment bill that seeks to alter the federal provisions of the Constitution (such as representation of states in Parliament) requires:",
    ["Special majority of Parliament and ratification by legislatures of not less than one-half of the States by simple majority", "Two-thirds majority of both Houses only without state involvement", "Simple majority of Parliament", "Three-fourths majority of both Houses and all States"],
    "A",
    "Article 368(2) specifies that amendments affecting federal structure (election of President, distribution of legislative powers between Union and States, representation of States in Parliament, Supreme Court/High Court powers) require special majority in Parliament plus ratification by legislatures of at least 50% of the States.",
    ref="Indian Polity by M. Laxmikanth, Chapter on Amendment", diff="MEDIUM", year=2024)

add_gs(11, "Indian Polity & Constitution", "Constitutional Law", "Basic Structure Doctrine",
    "The historic doctrine of 'Basic Structure' of the Indian Constitution was propounded by the Supreme Court in:",
    ["Kesavananda Bharati v. State of Kerala (1973)", "Golaknath v. State of Punjab (1967)", "Minerva Mills v. Union of India (1980)", "Shankari Prasad v. Union of India (1951)"],
    "A",
    "In Kesavananda Bharati (1973), a 13-judge bench held by a 7-6 majority that Parliament's amending power under Article 368 is not unlimited and cannot alter, damage, or destroy the 'basic structure' of the Constitution.",
    ref="Landmark Judgements of the Supreme Court", diff="EASY", year=2023)

add_gs(12, "Indian Polity & Constitution", "Local Self Government", "73rd Amendment & 11th Schedule",
    "The 73rd Constitutional Amendment Act, 1992 added the Eleventh Schedule to the Constitution containing how many functional items for Panchayats?",
    ["29 functional items", "18 functional items", "12 functional items", "35 functional items"],
    "A",
    "The 11th Schedule (added by the 73rd Amendment) contains 29 functional subjects placed within the purview of Panchayats. The 12th Schedule (added by the 74th Amendment for Municipalities) contains 18 functional items.",
    ref="Constitution of India, 11th Schedule", diff="EASY", year=2024)

add_gs(13, "Indian Polity & Constitution", "Parliament & State Legislatures", "Anti-Defection Law (10th Schedule)",
    "Under the Tenth Schedule (Anti-Defection Law) of the Constitution, questions regarding disqualification on grounds of defection are decided by:",
    ["The Chairman or the Speaker of the respective House", "The President of India on advice of the Election Commission", "The Supreme Court of India directly", "The Attorney General of India"],
    "A",
    "Paragraph 6 of the Tenth Schedule states that any question regarding disqualification arising out of defection shall be referred to and decided by the Chairman (Rajya Sabha/Legislative Council) or the Speaker (Lok Sabha/Legislative Assembly). In Kihoto Hollohan (1992), this decision was made subject to judicial review.",
    ref="Constitution of India, Tenth Schedule", diff="MEDIUM", year=2023)

add_gs(14, "Indian Polity & Constitution", "Emergency Provisions", "National Emergency Grounds",
    "By which Constitutional Amendment was the phrase 'internal disturbance' replaced with 'armed rebellion' as a ground for proclaiming National Emergency under Article 352?",
    ["44th Constitutional Amendment Act, 1978", "42nd Constitutional Amendment Act, 1976", "38th Constitutional Amendment Act, 1975", "52nd Constitutional Amendment Act, 1985"],
    "A",
    "The 44th Amendment Act of 1978 introduced crucial safeguards to prevent misuse of emergency provisions, substituting 'armed rebellion' for the vague term 'internal disturbance' under Article 352.",
    ref="Constitution of India, Article 352 & 44th Amendment", diff="MEDIUM", year=2022)

add_gs(15, "Indian Polity & Constitution", "Emergency Provisions", "Financial Emergency Status",
    "How many times has a Financial Emergency been declared in India under Article 360 since the adoption of the Constitution?",
    ["Never", "Once (during 1991 balance of payments crisis)", "Twice", "Three times"],
    "A",
    "A Financial Emergency under Article 360 of the Constitution has NEVER been declared in India so far.",
    ref="Indian Polity by M. Laxmikanth, Emergency Provisions", diff="EASY", year=2021)

add_gs(16, "Indian Polity & Constitution", "Constitutional Bodies", "Comptroller and Auditor General (CAG)",
    "The audit reports of the Comptroller and Auditor General of India (CAG) submitted under Article 151 are examined by which Parliamentary Committee?",
    ["Public Accounts Committee (PAC)", "Estimates Committee", "Committee on Public Undertakings (COPU)", "Business Advisory Committee"],
    "A",
    "The Public Accounts Committee (PAC) examines the audit reports of the CAG. The CAG acts as a 'guide, friend, and philosopher' to the PAC.",
    ref="Indian Polity by M. Laxmikanth, Chapter on CAG", diff="EASY", year=2024)

add_gs(17, "Indian Polity & Constitution", "Constitutional Bodies", "Finance Commission Composition",
    "Under Article 280 of the Indian Constitution, the Finance Commission is constituted by the President of India every:",
    ["Fifth year (or earlier)", "Third year", "Sixth year", "Seventh year"],
    "A",
    "Article 280 mandates that the President shall, at the expiration of every fifth year or at such earlier time as he considers necessary, constitute a Finance Commission consisting of a Chairman and four other members.",
    ref="Constitution of India, Article 280", diff="EASY", year=2023)

add_gs(18, "Indian Polity & Constitution", "Constitutional Bodies", "Election Commission Multi-Member Status",
    "The Election Commission of India, which originally operated as a single-member body, became a permanent multi-member body consisting of the Chief Election Commissioner and two Election Commissioners in:",
    ["October 1993", "January 1950", "December 1976", "August 1989"],
    "A",
    "The Election Commission was made a multi-member body briefly in 1989 and permanently functioning with 1 CEC and 2 ECs since October 1, 1993 under the Chief Election Commissioner and other Election Commissioners (Conditions of Service) Amendment Act.",
    ref="Election Commission of India Governance Structure", diff="MEDIUM", year=2024)

# --- INDIAN HISTORY & NATIONAL MOVEMENT (19 - 36) ---
add_gs(19, "Indian History & National Movement", "Ancient India", "Indus Valley Civilization Lothal",
    "At which Indus Valley Civilization site has an artificial brick dockyard connected to the Sabarmati river basin been excavated?",
    ["Lothal (Gujarat)", "Mohenjodaro (Sindh)", "Kalibangan (Rajasthan)", "Rakhigarhi (Haryana)"],
    "A",
    "Lothal, located in Gujarat at the head of the Gulf of Cambay, served as a major maritime port and trading centre of the Harappan civilization, featuring a massive tidal dockyard.",
    ref="Ancient India (NCERT) by R.S. Sharma", diff="EASY", year=2024)

add_gs(20, "Indian History & National Movement", "Ancient India", "Rigveda & Gayatri Mantra",
    "The famous 'Gayatri Mantra' addressed to deity Savitr is composed in which Mandala of the Rigveda?",
    ["Mandala 3", "Mandala 1", "Mandala 9", "Mandala 10"],
    "A",
    "The Gayatri Mantra is found in Mandala 3, Sukta 62, Verse 10 of the Rigveda, attributed to sage Vishwamitra. Mandala 9 is dedicated entirely to Soma, and Mandala 10 contains the Purusha Sukta.",
    ref="A History of Ancient and Early Medieval India by Upinder Singh", diff="MEDIUM", year=2023)

add_gs(21, "Indian History & National Movement", "Ancient India", "Buddhism & First Sermon",
    "Gautama Buddha delivered his first sermon, known as the 'Dharmachakrapravartana' (Turning of the Wheel of Law), at:",
    ["Sarnath (near Varanasi)", "Bodh Gaya", "Kushinagar", "Lumbini"],
    "A",
    "Buddha attained enlightenment under the Bodhi tree at Bodh Gaya and delivered his first sermon to his five former companions at the Deer Park in Sarnath. He passed away (Mahaparinirvana) at Kushinagar.",
    ref="Ancient India by R.S. Sharma", diff="EASY", year=2022)

add_gs(22, "Indian History & National Movement", "Ancient India", "Jainism Tirthankaras",
    "Vardhamana Mahavira was the which number Tirthankara in the Jain religious tradition?",
    ["24th Tirthankara", "1st Tirthankara", "23rd Tirthankara", "20th Tirthankara"],
    "A",
    "Rishabhanatha (Adinatha) was the first Tirthankara, Parshvanatha was the 23rd Tirthankara, and Vardhamana Mahavira was the 24th and last Tirthankara of the current cosmic age.",
    ref="History of India by Romila Thapar", diff="EASY", year=2021)

add_gs(23, "Indian History & National Movement", "Ancient India", "Mauryan Empire & Ashokan Inscriptions",
    "Which Major Rock Edict of Emperor Ashoka provides an authentic first-person account of the tragic devastation of the Kalinga War and his transformation to Dhamma?",
    ["Major Rock Edict XIII", "Major Rock Edict I", "Major Rock Edict VII", "Pillar Edict VII"],
    "A",
    "Major Rock Edict XIII explicitly describes Ashoka's remorse over the slaughter, death, and deportation of thousands during the Kalinga war (261 BC), marking his decisive shift from Bherighosha (war drum) to Dhammaghosha.",
    ref="Asoka and the Decline of the Mauryas by Romila Thapar", diff="EASY", year=2024)

add_gs(24, "Indian History & National Movement", "Ancient India", "Gupta Golden Age",
    "The celebrated astronomer-mathematician Aryabhata, author of Aryabhatiya and Surya Siddhanta, flourished during the reign of which dynasty?",
    ["Gupta Dynasty", "Mauryan Dynasty", "Kushan Dynasty", "Vardhana Dynasty"],
    "A",
    "Aryabhata (476-550 AD) lived during the Gupta period in Kusumapura (Pataliputra), calculating the value of pi (3.1416), proposing that the Earth rotates on its axis, and accurately explaining solar and lunar eclipses.",
    ref="NCERT Class XI Ancient India", diff="EASY", year=2023)

add_gs(25, "Indian History & National Movement", "Medieval India", "Delhi Sultanate Market Reforms",
    "Which Sultan of Delhi implemented comprehensive price control and market regulation systems (Shahna-i-Mandi) to maintain a massive standing army at low cost?",
    ["Alauddin Khilji", "Balban", "Muhammad bin Tughlaq", "Feroz Shah Tughlaq"],
    "A",
    "Alauddin Khilji (1296-1316) instituted strict price controls, grain storage depots, and intelligence officers (Barids and Munhiyans) to fix prices of food grains, textiles, and cattle in Delhi.",
    ref="Medieval India (NCERT) by Satish Chandra", diff="EASY", year=2024)

add_gs(26, "Indian History & National Movement", "Medieval India", "Vijayanagara Empire",
    "The greatest ruler of the Tuluva dynasty of Vijayanagara, Krishna Deva Raya (1509-1529), authored the classic Telugu political treatise named:",
    ["Amuktamalyada", "Manucharitam", "Rayavachakamu", "Madura Vijayam"],
    "A",
    "Emperor Krishna Deva Raya composed 'Amuktamalyada' in Telugu and 'Jambavati Kalyanam' in Sanskrit. His court was famously adorned by the Ashtadiggajas (eight eminent Telugu poets).",
    ref="A History of South India by K.A. Nilakanta Sastri", diff="MEDIUM", year=2022)

add_gs(27, "Indian History & National Movement", "Medieval India", "Mughal Administration",
    "The Mansabdari system, the cornerstone of military and civil administration in the Mughal Empire, was introduced by Emperor:",
    ["Akbar (1571)", "Babur", "Humayun", "Shah Jahan"],
    "A",
    "Akbar introduced the Mansabdari system in 1571. Every officer held a rank (Mansab) characterized by two numbers: 'Zat' (personal rank determining salary status) and 'Sawar' (number of cavalrymen required to maintain).",
    ref="Medieval India by Satish Chandra", diff="EASY", year=2024)

add_gs(28, "Indian History & National Movement", "Modern India", "Revolt of 1857 Leaders",
    "Who among the following led the 1857 Revolt against British rule from Jagdishpur in Bihar?",
    ["Kunwar Singh", "Nana Saheb", "Maulvi Ahmadullah", "Bakht Khan"],
    "A",
    "Kunwar Singh, the octogenarian Zamindar of Jagdishpur (Arrah, Bihar), was one of the most valiant military leaders of the 1857 revolt. Nana Saheb led at Kanpur, Begum Hazrat Mahal at Lucknow, and Khan Bahadur Khan at Bareilly.",
    ref="India's Struggle for Independence by Bipan Chandra", diff="EASY", year=2023)

add_gs(29, "Indian History & National Movement", "Modern India", "Social Reform Movements",
    "Raja Ram Mohan Roy founded the 'Brahmo Sabha' (later Brahmo Samaj) in 1828 and successfully campaigned for the legal abolition of Sati, which was enacted under Governor-General:",
    ["Lord William Bentinck (Regulation XVII of 1829)", "Lord Dalhousie", "Lord Canning", "Lord Wellesley"],
    "A",
    "The Bengal Sati Regulation XVII was enacted on December 4, 1829 by Governor-General Lord William Bentinck, declaring the practice of Sati or burning alive of widows illegal and punishable by criminal courts.",
    ref="Modern India by Bipan Chandra", diff="EASY", year=2024)

add_gs(30, "Indian History & National Movement", "National Movement", "Formation of Indian National Congress",
    "The first session of the Indian National Congress was held in December 1885 at Bombay under the presidency of:",
    ["Womesh Chandra Bonnerjee", "Dadabhai Naoroji", "Allan Octavian Hume", "Surendranath Banerjee"],
    "A",
    "The first INC session took place at Gokuldas Tejpal Sanskrit College, Bombay in December 1885, presided over by W.C. Bonnerjee and attended by 72 delegates. A.O. Hume served as general secretary.",
    ref="History of the Freedom Movement in India by Tara Chand", diff="EASY", year=2022)

add_gs(31, "Indian History & National Movement", "National Movement", "Partition of Bengal 1905",
    "The Partition of Bengal announced by Lord Curzon took effect on October 16, 1905, leading immediately to which mass national protest movement?",
    ["Swadeshi and Boycott Movement", "Non-Cooperation Movement", "Quit India Movement", "Civil Disobedience Movement"],
    "A",
    "The partition sparked the Swadeshi and Boycott Movement, officially proclaimed at the Calcutta Town Hall on August 7, 1905. People observed October 16 as a day of national mourning, tying Rakhis and singing Vande Mataram.",
    ref="India's Struggle for Independence by Bipan Chandra", diff="EASY", year=2024)

add_gs(32, "Indian History & National Movement", "National Movement", "Morley-Minto Reforms 1909",
    "The Indian Councils Act, 1909 (Morley-Minto Reforms) is famously known for introducing which controversial political provision?",
    ["Separate electorates for Muslims", "Dyarchy in the provincial executive", "Bicameralism at the Centre", "Direct elections for all citizens"],
    "A",
    "The 1909 Act introduced communal representation for Muslims through separate electorates, institutionalizing religious separatism in Indian electoral politics.",
    ref="Modern India by Bipan Chandra", diff="EASY", year=2023)

add_gs(33, "Indian History & National Movement", "National Movement", "Non-Cooperation Movement Suspension",
    "Mahatma Gandhi abruptly called off the nationwide Non-Cooperation Movement in February 1922 following which violent incident?",
    ["Chauri Chaura Incident (Gorakhpur)", "Jallianwala Bagh Massacre", "Kakori Train Robbery", "Chittagong Armoury Raid"],
    "A",
    "On February 4, 1922, an agitated crowd clashed with police and set fire to the Chauri Chaura police station in Gorakhpur district (UP), killing 22 policemen. Committed to absolute non-violence (Ahimsa), Gandhi suspended the movement on February 12 via the Bardoli resolution.",
    ref="My Experiments with Truth / Bipan Chandra", diff="EASY", year=2024)

add_gs(34, "Indian History & National Movement", "National Movement", "Civil Disobedience & Dandi March",
    "Mahatma Gandhi launched the Civil Disobedience Movement on March 12, 1930 with the historic Dandi March, walking 240 miles from Sabarmati Ashram to Dandi in:",
    ["24 days", "12 days", "30 days", "40 days"],
    "A",
    "Accompanied by 78 chosen ashram followers, Gandhi walked 240 miles from Sabarmati to coastal Dandi in 24 days, breaking the colonial salt law on morning of April 6, 1930 by picking up a lump of natural salt.",
    ref="India's Struggle for Independence", diff="MEDIUM", year=2023)

add_gs(35, "Indian History & National Movement", "Constitutional History", "Government of India Act 1935",
    "Which of the following was a key feature introduced by the Government of India Act, 1935?",
    ["Introduction of Provincial Autonomy and abolition of dyarchy in the provinces", "Establishment of a Constituent Assembly", "Partition of British India", "Grant of complete independence (Purna Swaraj)"],
    "A",
    "The 1935 Act abolished dyarchy in the provinces and established 'Provincial Autonomy', giving provinces separate legal identity and responsible government. It also proposed an All-India Federation and introduced dyarchy at the Centre.",
    ref="Constitutional History of India", diff="MEDIUM", year=2024)

add_gs(36, "Indian History & National Movement", "National Movement", "Quit India Movement 1942",
    "The historic resolution for the 'Quit India Movement' with Mahatma Gandhi's mantra 'Do or Die' (Karo ya Maro) was passed by the AICC at Gowalia Tank Maidan on:",
    ["August 8, 1942", "July 14, 1942", "September 15, 1942", "January 26, 1942"],
    "A",
    "The All-India Congress Committee met at Gowalia Tank (now August Kranti Maidan) in Bombay and ratified the Quit India resolution on August 8, 1942. The British launched 'Operation Zero Hour' before dawn on August 9, arresting all top national leaders.",
    ref="India's Struggle for Independence by Bipan Chandra", diff="EASY", year=2024)

# --- PHYSICAL, INDIAN & WORLD GEOGRAPHY & ECOLOGY (37 - 52) ---
add_gs(37, "Geography & Ecology", "Physical Geography", "Earthquake Waves",
    "With reference to earthquake seismic waves, which of the following statements is correct?",
    ["Primary waves (P-waves) are longitudinal and can travel through solids, liquids, and gases", "Secondary waves (S-waves) can travel through both liquids and solids", "Surface waves travel faster than P-waves", "S-waves are longitudinal compressional waves"],
    "A",
    "P-waves (Primary waves) are longitudinal compressional waves capable of travelling through solid, liquid, and gaseous media. S-waves (Secondary waves) are transverse shear waves that can travel ONLY through solid materials, creating the S-wave shadow zone beyond 105°.",
    ref="Certificate Physical and Human Geography by Goh Cheng Leong", diff="MEDIUM", year=2024)

add_gs(38, "Geography & Ecology", "Atmospheric Science", "Atmospheric Layers & Ozone",
    "In which layer of the Earth's atmosphere is the protective Ozone layer (Ozonosphere) primarily concentrated?",
    ["Stratosphere", "Troposphere", "Mesosphere", "Thermosphere"],
    "A",
    "The stratosphere (extending from roughly 12 km to 50 km above surface) contains the ozone layer, which absorbs lethal solar ultraviolet-B (UV-B) radiation.",
    ref="Physical Geography (NCERT Class XI)", diff="EASY", year=2023)

add_gs(39, "Geography & Ecology", "Climatology", "Indian Monsoon Mechanisms",
    "The periodic reversal of wind direction in the Indian subcontinent known as the Indian Monsoon is heavily influenced by the seasonal heating and low-pressure formation over:",
    ["The Tibetan Plateau and northwestern Indian plains", "The Deccan Plateau", "The Southern Ocean", "The Bay of Bengal"],
    "A",
    "Intense summer heating of the high-altitude Tibetan Plateau acts as a thermal engine, creating a strong low pressure and upper-tropospheric easterly jet stream that pulls the moisture-laden Southwest Monsoon winds from the Indian Ocean.",
    ref="India: Physical Environment (NCERT)", diff="EASY", year=2024)

add_gs(40, "Geography & Ecology", "Indian Drainage Systems", "Indus Water Treaty 1960",
    "Under the Indus Waters Treaty (1960) mediated by the World Bank, India has unrestricted rights to the waters of which three Eastern Rivers?",
    ["Ravi, Beas, and Sutlej", "Indus, Jhelum, and Chenab", "Jhelum, Chenab, and Ravi", "Sutlej, Chenab, and Indus"],
    "A",
    "The Indus Waters Treaty allocated the three 'Eastern Rivers' (Sutlej, Beas, Ravi) exclusively to India, while the three 'Western Rivers' (Indus, Jhelum, Chenab) were allocated primarily to Pakistan, with India having specified run-of-the-river usage rights.",
    ref="Geography of India by Majid Husain", diff="EASY", year=2024)

add_gs(41, "Geography & Ecology", "Indian Drainage Systems", "West Flowing Rift Valley Rivers",
    "Which pair of major Indian rivers flows westward through geological rift valleys between mountain ranges and empties into the Arabian Sea without forming deltas?",
    ["Narmada and Tapti", "Godavari and Krishna", "Mahanadi and Cauvery", "Sabarmati and Mahi"],
    "A",
    "The Narmada (flowing between Vindhya and Satpura ranges) and Tapti (flowing south of Satpura) occupy tectonic rift valleys and drain westward into the Arabian Sea, forming estuaries rather than extensive alluvial deltas.",
    ref="India: Physical Environment (NCERT)", diff="EASY", year=2023)

add_gs(42, "Geography & Ecology", "Soil Geography", "Black Cotton / Regur Soil",
    "Black soil (Regur soil), celebrated for commercial cotton cultivation in the Deccan trap region, is predominantly derived from the weathering of:",
    ["Basaltic lava rocks", "Granite and gneiss", "Sandstone and shale", "Limestone and dolomite"],
    "A",
    "Black soils are formed from the decomposition of volcanic basaltic lava of the Deccan Trap. Rich in montmorillonite clay mineral, they exhibit remarkable water retention, swelling when wet and cracking self-ploughing fissures when dry.",
    ref="Geography of India by Majid Husain", diff="EASY", year=2024)

add_gs(43, "Geography & Ecology", "Mineral Resources", "Chhota Nagpur Plateau",
    "The Chhota Nagpur Plateau, frequently described as the 'Ruhr of India' due to its vast concentration of coal, iron ore, and mica, is spread across which primary states?",
    ["Jharkhand, West Bengal, Odisha, and Chhattisgarh", "Maharashtra and Madhya Pradesh", "Karnataka and Tamil Nadu", "Rajasthan and Gujarat"],
    "A",
    "The Chhota Nagpur Plateau in eastern India covers much of Jharkhand and adjacent portions of West Bengal, Odisha, and Chhattisgarh. It contains India's premier coalfields (Jharia, Raniganj, Bokaro) and iron ore deposits.",
    ref="Economic Geography of India", diff="EASY", year=2022)

add_gs(44, "Geography & Ecology", "Biogeography & Forestry", "Most Widespread Forest Type",
    "Which forest type occupies the largest geographical percentage of India's total forest cover?",
    ["Tropical Deciduous Forests (Monsoon Forests)", "Tropical Wet Evergreen Forests", "Montane Temperate Forests", "Mangrove Tidal Forests"],
    "A",
    "Tropical Deciduous Forests (divided into Moist and Dry Deciduous) are the most widespread in India, covering over 60% of the total forested area. Dominant species include Teak, Sal, Shisham, and Mahua.",
    ref="India State of Forest Report (ISFR)", diff="EASY", year=2024)

add_gs(45, "Geography & Ecology", "Ecology & Wetlands", "Ramsar Convention Deepor Beel",
    "Deepor Beel, a permanent freshwater lake and major wildlife haven designated as Assam's sole Ramsar site, is located in which district?",
    ["Kamrup Metropolitan (Guwahati)", "Nagaon", "Jorhat", "Dibrugarh"],
    "A",
    "Deepor Beel is a sprawling riverine wetland in Kamrup Metropolitan district southwest of Guwahati city. It was designated as a Ramsar site in November 2002 for its biological and ecological importance.",
    ref="Assam State Biodiversity Board Records", diff="EASY", year=2023)

add_gs(46, "Geography & Ecology", "Biodiversity Conservation", "Biodiversity Hotspots in India",
    "According to Conservation International criteria, how many global Biodiversity Hotspots are found wholly or partially within India's borders?",
    ["4 Hotspots (Himalaya, Western Ghats, Indo-Burma, Sundaland)", "2 Hotspots", "6 Hotspots", "8 Hotspots"],
    "A",
    "India represents four globally recognized biodiversity hotspots: 1. The Himalayas, 2. The Western Ghats (and Sri Lanka), 3. Indo-Burma (including Northeast India), and 4. Sundaland (including Nicobar Islands).",
    ref="Environment by Shankar IAS Academy", diff="EASY", year=2024)

add_gs(47, "Geography & Ecology", "Conservation Reserves", "First Biosphere Reserve in India",
    "Which was the first Biosphere Reserve established in India under UNESCO's Man and the Biosphere (MAB) Programme in 1986?",
    ["Nilgiri Biosphere Reserve", "Nanda Devi Biosphere Reserve", "Sundarbans Biosphere Reserve", "Gulf of Mannar Biosphere Reserve"],
    "A",
    "The Nilgiri Biosphere Reserve, located at the tri-junction of Tamil Nadu, Kerala, and Karnataka in the Western Ghats, was the first biosphere reserve designated in India in 1986.",
    ref="Ministry of Environment, Forest and Climate Change (MoEFCC)", diff="EASY", year=2022)

add_gs(48, "Geography & Ecology", "Wildlife Conservation", "Project Tiger Inception",
    "India's flagship conservation initiative 'Project Tiger' was launched in which year and from which National Park?",
    ["1973 from Jim Corbett National Park (Uttarakhand)", "1972 from Kaziranga National Park", "1980 from Ranthambore National Park", "1985 from Kanha National Park"],
    "A",
    "Project Tiger was launched on April 1, 1973 by the Government of India under Prime Minister Indira Gandhi from Jim Corbett National Park, following the enactment of the Wildlife (Protection) Act, 1972.",
    ref="National Tiger Conservation Authority (NTCA)", diff="EASY", year=2023)

add_gs(49, "Geography & Ecology", "Climate Change", "Paris Agreement COP21 Goals",
    "Under the landmark Paris Agreement adopted at COP21 in 2015, nations committed to holding the increase in global average temperature to:",
    ["Well below 2.0°C above pre-industrial levels and pursuing efforts to limit it to 1.5°C", "Below 3.0°C by 2100", "Zero degree change from 2000 levels", "Below 4.0°C with economic offsets"],
    "A",
    "Article 2 of the Paris Agreement sets the goal of holding global warming 'well below 2°C above pre-industrial levels and pursuing efforts to limit the temperature increase to 1.5°C'.",
    ref="UNFCCC Paris Agreement Text", diff="EASY", year=2024)

add_gs(50, "Geography & Ecology", "Environmental Pollution", "National Air Quality Index (AQI)",
    "The National Air Quality Index (AQI) in India monitors atmospheric concentrations of how many criteria air pollutants?",
    ["8 pollutants (PM10, PM2.5, NO2, SO2, CO, O3, NH3, and Pb)", "5 pollutants", "12 pollutants", "6 pollutants"],
    "A",
    "The Central Pollution Control Board (CPCB) computes the National AQI across 8 pollutants: Particulate Matter (PM10 and PM2.5), Nitrogen Dioxide (NO2), Sulphur Dioxide (SO2), Carbon Monoxide (CO), Ozone (O3), Ammonia (NH3), and Lead (Pb).",
    ref="Central Pollution Control Board (CPCB) Guidelines", diff="MEDIUM", year=2023)

add_gs(51, "Geography & Ecology", "Oceanography", "Ocean Currents Fishing Grounds",
    "The convergence zone of the warm Gulf Stream and the cold Labrador Current off the coast of Newfoundland (Grand Banks) creates world-famous:",
    ["Rich commercial fishing grounds and dense navigational fogs", "Tropical cyclones and warm lagoons", "Deserts on adjacent landmasses", "Volcanic island arcs"],
    "A",
    "The mixing of warm and cold currents produces upwelling of deep nutrient-rich waters that nourish abundant marine plankton, creating exceptional fishing grounds. It also causes condensation and hazardous maritime fog.",
    ref="Physical Geography by Strahler", diff="EASY", year=2024)

add_gs(52, "Geography & Ecology", "Marine Ecosystems", "Coral Bleaching Cause",
    "What is the primary scientific cause of large-scale 'Coral Bleaching' events witnessed in coral reef systems worldwide?",
    ["Expulsion of photosynthetic symbiotic algae (zooxanthellae) due to thermal sea surface temperature rise", "Deposition of industrial heavy metal toxins", "Attack by crown-of-thorns starfish only", "Overfishing of reef sharks"],
    "A",
    "Corals maintain an obligate mutualistic relationship with microscopic dinoflagellate algae (zooxanthellae). Sustained elevated sea water temperatures cause metabolic stress, causing corals to expel the algae and turn stark white, leading to starvation and death.",
    ref="Marine Biology by Castro & Huber", diff="MEDIUM", year=2024)

# --- INDIAN ECONOMY & DEVELOPMENT (53 - 66) ---
add_gs(53, "Indian Economy & Development", "National Income Accounting", "National Income Definition",
    "In national income accounting in India, 'National Income' strictly refers to:",
    ["Net National Product at Factor Cost (NNP at FC)", "Gross Domestic Product at Market Prices (GDP at MP)", "Gross National Product at Factor Cost (GNP at FC)", "Net Domestic Product at Market Prices (NDP at MP)"],
    "A",
    "National Income (NI) = NNP at Factor Cost = GNP at MP - Depreciation - Net Indirect Taxes (Indirect taxes - Subsidies). It measures the net domestic and foreign factor earnings accrued to normal residents of a country.",
    ref="Macroeconomics (NCERT Class XII)", diff="EASY", year=2024)

add_gs(54, "Indian Economy & Development", "Inflation & Price Indices", "Inflation Targeting Framework",
    "Under the flexible inflation targeting framework adopted by the Reserve Bank of India, monetary policy targets which inflation metric within a band of 4% (+/- 2%)?",
    ["Consumer Price Index Combined (CPI-C)", "Wholesale Price Index (WPI)", "GDP Deflator", "Index of Industrial Production (IIP)"],
    "A",
    "Under the amended RBI Act (1934), the Monetary Policy Framework Agreement specifies headline Consumer Price Index (CPI-Combined) as the nominal anchor for inflation targeting at 4% with an allowable tolerance band of +/- 2% (2% to 6%).",
    ref="RBI Monetary Policy Reports", diff="EASY", year=2023)

add_gs(55, "Indian Economy & Development", "Banking & Monetary Policy", "Monetary Policy Committee Composition",
    "The Monetary Policy Committee (MPC) of the Reserve Bank of India consists of how many members, and who is its ex-officio Chairperson?",
    ["6 members, chaired by the Governor of the Reserve Bank of India", "5 members, chaired by the Union Finance Minister", "7 members, chaired by the Chief Economic Advisor", "6 members, chaired by the Deputy Governor in charge of monetary policy"],
    "A",
    "The MPC comprises six members: three internal RBI officials (Governor as ex-officio Chair, Deputy Governor in charge of monetary policy, and one officer) plus three independent external experts appointed by the Central Government.",
    ref="Reserve Bank of India Act, 1934 (Section 45ZB)", diff="EASY", year=2024)

add_gs(56, "Indian Economy & Development", "Monetary Policy Instruments", "Cash Reserve Ratio (CRR)",
    "If the Reserve Bank of India decides to increase the Cash Reserve Ratio (CRR), what is the immediate effect on commercial banks?",
    ["It decreases the lending capacity and liquidity of commercial banks", "It increases commercial bank profitability and credit creation", "It lowers interest rates on consumer loans", "It has no impact on money supply in the economy"],
    "A",
    "Cash Reserve Ratio is the specified minimum fraction of Net Demand and Time Liabilities (NDTL) that commercial banks must maintain as cash reserves with the RBI. Raising CRR impounds liquidity, reducing credit availability and controlling inflation.",
    ref="Indian Economy by Ramesh Singh", diff="EASY", year=2023)

add_gs(57, "Indian Economy & Development", "Public Finance & Budgeting", "Fiscal Deficit Formula",
    "The 'Fiscal Deficit' in the Union Budget of India is defined as:",
    ["Total Budgetary Expenditure minus Total Receipts excluding Borrowings", "Revenue Expenditure minus Revenue Receipts", "Fiscal Deficit minus Interest Payments", "Total Expenditure minus Tax Revenue only"],
    "A",
    "Fiscal Deficit = Total Expenditure - (Revenue Receipts + Non-debt Capital Receipts). It reflects the total net borrowing requirement of the government from domestic and external sources during the financial year.",
    ref="Union Budget Economic Survey Glossary", diff="EASY", year=2024)

add_gs(58, "Indian Economy & Development", "Taxation System", "GST Constitutional Basis",
    "The Goods and Services Tax (GST) was introduced in India with effect from July 1, 2017 through which Constitutional Amendment Act?",
    ["101st Constitutional Amendment Act, 2016", "100th Constitutional Amendment Act, 2015", "102nd Constitutional Amendment Act, 2018", "103rd Constitutional Amendment Act, 2019"],
    "A",
    "The 101st Constitutional Amendment Act, 2016 enabled the concurrent taxation of goods and services by Parliament and State Legislatures (Article 246A) and established the constitutional GST Council (Article 279A).",
    ref="Ministry of Finance, Government of India", diff="EASY", year=2022)

add_gs(59, "Indian Economy & Development", "Economic Planning", "NITI Aayog Establishment",
    "NITI Aayog (National Institution for Transforming India), which replaced the six-decade-old Planning Commission on January 1, 2015, functions as a:",
    ["Policy think tank promoting cooperative federalism", "Constitutional body with powers to allocate central funds", "Statutory financial regulator under Parliament", "Judicial dispute resolution body between states"],
    "A",
    "NITI Aayog was established by an executive cabinet resolution on January 1, 2015. Unlike the Planning Commission, it possesses no mandate to disburse financial grants, serving strictly as a strategic and technical think tank promoting cooperative federalism.",
    ref="NITI Aayog Official Charter", diff="EASY", year=2024)

add_gs(60, "Indian Economy & Development", "Planning History", "Second Five Year Plan Model",
    "India's Second Five-Year Plan (1956-1961), which laid foundational emphasis on rapid industrialization and heavy basic capital goods industries, was based on the model developed by:",
    ["Prasanta Chandra Mahalanobis", "Harrod and Domar", "C. Rangarajan", "Amartya Sen and Jagdish Bhagwati"],
    "A",
    "The Second Plan was based on the celebrated Feldman-Mahalanobis two-sector / four-sector economic growth model, emphasizing heavy public sector investments in steel, machinery, power, and capital infrastructure.",
    ref="Indian Economy: Performance and Policies by Uma Kapila", diff="EASY", year=2023)

add_gs(61, "Indian Economy & Development", "External Sector", "Current Account Deficit Components",
    "In India's Balance of Payments (BoP), which of the following transactions is recorded under the 'Capital Account' rather than the 'Current Account'?",
    ["Foreign Direct Investment (FDI) inflows", "Merchandise export of petroleum products", "Software service exports (IT invisibles)", "Remittances sent home by non-resident Indians (unilateral transfers)"],
    "A",
    "The Current Account encompasses merchandise trade (exports/imports of goods), service trade (invisibles), income, and unilateral transfers/remittances. The Capital Account records asset ownership transactions such as Foreign Direct Investment (FDI), Foreign Portfolio Investment (FPI), and external commercial borrowings.",
    ref="Balance of Payments Manual (RBI / IMF)", diff="MEDIUM", year=2024)

add_gs(62, "Indian Economy & Development", "Poverty & Social Welfare", "Tendulkar Committee Methodology",
    "The Expert Group on Poverty Estimation headed by Suresh Tendulkar (2009) departed from earlier nutritional norms by anchoring the poverty line calculation on:",
    ["Per capita private consumption expenditure on food, education, and health", "Strictly minimum daily caloric intake of 2400 kcal in rural areas", "Ownership of permanent agricultural land", "Formal household income reported on income tax returns"],
    "A",
    "The Tendulkar Committee shifted away from purely calorie-based thresholds to Monthly Per Capita Consumer Expenditure (MPCE) using basket valuations that included essential health, schooling, and transport expenditures.",
    ref="Planning Commission Report on Poverty Estimation", diff="MEDIUM", year=2023)

add_gs(63, "Indian Economy & Development", "Banking Regulations", "Priority Sector Lending Targets",
    "For domestic commercial banks operating in India, the overall mandatory Priority Sector Lending (PSL) target set by the RBI is what percentage of Adjusted Net Bank Credit (ANBC)?",
    ["40% of ANBC", "25% of ANBC", "50% of ANBC", "18% of ANBC"],
    "A",
    "Domestic scheduled commercial banks and foreign banks with 20 or more branches must allocate 40% of Adjusted Net Bank Credit (ANBC) or credit equivalent of off-balance sheet exposure to priority sectors (Agriculture, MSME, Education, Housing, Renewable Energy).",
    ref="RBI Master Directions on Priority Sector Lending", diff="EASY", year=2024)

add_gs(64, "Indian Economy & Development", "Employment Schemes", "MGNREGA Statutory Guarantee",
    "The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA), 2005 legally guarantees how many days of wage employment in a financial year to every rural household?",
    ["100 days of unskilled manual labour", "150 days of skilled labour", "200 days of agricultural labour", "75 days of rural public works"],
    "A",
    "MGNREGA provides a statutory legal right to at least 100 days of guaranteed wage employment per financial year to adult members of any rural household willing to do public work-related unskilled manual work.",
    ref="Ministry of Rural Development, Government of India", diff="EASY", year=2024)

add_gs(65, "Indian Economy & Development", "Agricultural Schemes", "PM-KISAN Cash Benefit",
    "Under the Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) scheme, eligible landholding farmer families receive income support of:",
    ["Rs 6,000 per year paid in three equal installments of Rs 2,000", "Rs 10,000 per year paid in two equal installments", "Rs 5,000 per month directly into bank accounts", "Rs 12,000 annually tied to crop sowing receipts"],
    "A",
    "PM-KISAN is a central sector scheme providing direct financial assistance of Rs 6,000 per year in three equal four-monthly installments of Rs 2,000 each into the Aadhaar-linked bank accounts of beneficiary farmers.",
    ref="Ministry of Agriculture and Farmers Welfare", diff="EASY", year=2023)

add_gs(66, "Indian Economy & Development", "Foreign Investment", "FDI Automatic Route",
    "Under the 'Automatic Route' of Foreign Direct Investment (FDI) in India:",
    ["Non-resident investors do not require prior approval from the Government or Reserve Bank of India", "Prior approval of the Union Cabinet is mandatory before remittance", "Investments can only be made through state-owned public financial institutions", "FDI is capped at a maximum of 26% across all sectors"],
    "A",
    "Under the Automatic Route, foreign investors do not need prior government or RBI approval; they simply notify the RBI within 30 days of receiving inward remittances and issuing shares.",
    ref="Department for Promotion of Industry and Internal Trade (DPIIT)", diff="EASY", year=2022)

# --- GENERAL SCIENCE & MODERN TECHNOLOGY (67 - 80) ---
add_gs(67, "General Science & Technology", "Physics", "Conservation of Momentum",
    "The recoil of a rifle upon firing a bullet is a direct practical demonstration of:",
    ["Newton's Third Law of Motion and Conservation of Linear Momentum", "Newton's First Law of Inertia only", "Law of Gravitation", "Bernoulli's Principle"],
    "A",
    "Total linear momentum of the system before firing is zero. Upon firing, the forward momentum of the bullet (+m·v) must be balanced by an equal and opposite backward momentum of the gun (-M·V), causing rifle recoil.",
    ref="NCERT Class IX Physics", diff="EASY", year=2024)

add_gs(68, "General Science & Technology", "Physics & Optics", "Total Internal Reflection Applications",
    "High-speed optical fiber communication networks transmit optical data signals through core fibers based on the principle of:",
    ["Total Internal Reflection (TIR)", "Optical Dispersion", "Light Polarization", "Diffraction of light rays"],
    "A",
    "In optical fibers, light enters the core (refractive index n1) surrounded by cladding (refractive index n2 < n1) at an angle greater than the critical angle, undergoing continuous Total Internal Reflection with near-zero transmission loss.",
    ref="NCERT Class XII Physics, Wave & Ray Optics", diff="EASY", year=2024)

add_gs(69, "General Science & Technology", "Physics", "Electromagnetic Wave Spectrum",
    "Which of the following electromagnetic radiations possesses the highest frequency and shortest wavelength?",
    ["Gamma Rays", "X-Rays", "Ultraviolet radiation", "Microwaves"],
    "A",
    "In the electromagnetic spectrum, Gamma rays have the highest frequencies (> 10¹⁹ Hz) and shortest wavelengths (< 10⁻¹² m), carrying the highest photon energies. Radio waves have the longest wavelengths.",
    ref="Concepts of Physics by H.C. Verma", diff="EASY", year=2023)

add_gs(70, "General Science & Technology", "Chemistry", "pH Scale & Gastric Acid",
    "Human gastric juice secreted in the stomach contains hydrochloric acid (HCl) having a highly acidic pH typically around:",
    ["1.5 to 2.5", "5.5 to 6.5", "7.4 (neutral)", "8.5 to 9.5"],
    "A",
    "Gastric acid secreted by parietal cells in stomach lining has a pH of approximately 1.5 to 2.0. This intense acidity activates pepsinogen into active protease pepsin and eliminates ingested pathogens.",
    ref="Human Physiology by Guyton and Hall", diff="EASY", year=2024)

add_gs(71, "General Science & Technology", "Chemistry", "Common Chemical Compounds",
    "The common domestic chemical known as 'Baking Soda' used in culinary baking is chemically:",
    ["Sodium Bicarbonate (NaHCO3)", "Sodium Carbonate decahydrate (Na2CO3·10H2O)", "Sodium Hydroxide (NaOH)", "Calcium Oxychloride (CaOCl2)"],
    "A",
    "Baking Soda is Sodium Bicarbonate (NaHCO3). Washing soda is Sodium Carbonate (Na2CO3·10H2O), Caustic soda is Sodium Hydroxide (NaOH), and Bleaching powder is Calcium Hypochlorite/Oxychloride (CaOCl2).",
    ref="NCERT Class X Chemistry", diff="EASY", year=2023)

add_gs(72, "General Science & Technology", "Biology & Cell Science", "Mitochondria Powerhouse",
    "Why is the organelle 'Mitochondria' commonly referred to as the 'Powerhouse of the Cell'?",
    ["It generates cellular energy in the form of Adenosine Triphosphate (ATP) via oxidative phosphorylation", "It synthesizes structural proteins for the cell membrane", "It stores genetic chromosomal information", "It digests cellular wastes through hydrolytic enzymes"],
    "A",
    "Mitochondria are sites of cellular respiration (Krebs cycle and electron transport chain), generating over 90% of cellular energy currency in the form of ATP molecules.",
    ref="Cell Biology by Lodish / NCERT Class XI", diff="EASY", year=2024)

add_gs(73, "General Science & Technology", "Genetics", "DNA Double Helix Discovery",
    "The double helical three-dimensional molecular model of DNA was discovered in 1953 by:",
    ["James Watson and Francis Crick", "Gregor Mendel", "Robert Hooke", "Louis Pasteur"],
    "A",
    "James Watson and Francis Crick published the double helix structure of DNA in Nature in April 1953, utilizing Rosalind Franklin and Maurice Wilkins' X-ray crystallography diffraction data.",
    ref="NCERT Class XII Genetics", diff="EASY", year=2022)

add_gs(74, "General Science & Technology", "Human Biology", "Universal Donor Blood Group",
    "In the human ABO and Rh blood grouping system, individuals with which blood group are considered 'Universal Donors'?",
    ["O Negative (O -ve)", "AB Positive (AB +ve)", "O Positive (O +ve)", "A Negative (A -ve)"],
    "A",
    "O-negative red blood cells contain neither A nor B surface antigens, nor the Rh(D) antigen. Hence they trigger no antibody-mediated hemolytic reactions in recipients, making O-negative the universal donor blood.",
    ref="NCERT Class XI Human Physiology", diff="EASY", year=2023)

add_gs(75, "General Science & Technology", "Health & Nutrition", "Vitamin Deficiency Diseases",
    "Deficiency of Vitamin C (Ascorbic Acid) in the human diet causes which deficiency disease characterized by bleeding gums and delayed wound healing?",
    ["Scurvy", "Rickets", "Beriberi", "Pellagra"],
    "A",
    "Vitamin C is a vital cofactor for collagen biosynthesis. Scurvy results from severe Vitamin C deficiency. Vitamin D deficiency causes Rickets; Vitamin B1 (Thiamine) deficiency causes Beriberi; Niacin (B3) deficiency causes Pellagra.",
    ref="Food and Nutrition Science", diff="EASY", year=2024)

add_gs(76, "General Science & Technology", "Human Health & Diseases", "Malaria Transmission Vector",
    "Malaria is caused by the protozoan parasite Plasmodium and transmitted to humans via the bite of infected:",
    ["Female Anopheles mosquito", "Female Aedes aegypti mosquito", "Culex mosquito", "Tsetse fly"],
    "A",
    "Malaria is transmitted by the female Anopheles mosquito. Aedes aegypti transmits Dengue, Chikungunya, and Zika. Culex transmits Filariasis (Elephantiasis) and Japanese Encephalitis.",
    ref="NCERT Class XII Biology, Human Health and Disease", diff="EASY", year=2024)

add_gs(77, "General Science & Technology", "Biotechnology & Vaccines", "mRNA Vaccine Platform",
    "How do mRNA-based vaccines (such as Pfizer-BioNTech and Moderna COVID-19 vaccines) stimulate protective immune responses?",
    ["By instructing host cells to synthesize the harmless viral spike protein to trigger neutralizing antibodies", "By injecting weakened live coronavirus directly into muscle cells", "By altering the permanent nuclear genomic DNA of human cells", "By introducing synthetic pre-formed monoclonal antibodies"],
    "A",
    "mRNA vaccines deliver synthetic messenger RNA encoding the viral spike protein wrapped in lipid nanoparticles. Ribosomes in host cells translate the mRNA into the viral protein, triggering robust humoral and cellular immune memory without entering the cell nucleus.",
    ref="Nature Reviews Immunology / WHO Vaccine Guidelines", diff="MEDIUM", year=2023)

add_gs(78, "General Science & Technology", "Nuclear Science", "Nuclear Fission vs Fusion",
    "The colossal energy generation in the core of the Sun and other stars is powered by which nuclear process?",
    ["Nuclear Fusion (hydrogen nuclei fusing into helium under extreme heat and gravitational pressure)", "Controlled Nuclear Fission of heavy Uranium isotopes", "Spontaneous Radioactive Alpha Decay", "Chemical combustion of compressed hydrogen gas"],
    "A",
    "The Sun operates via the proton-proton chain nuclear fusion reaction, where four hydrogen nuclei (protons) fuse to produce a helium-4 nucleus, with mass defect converted into immense energy per Einstein's equation E = m c².",
    ref="Astrophysics & Modern Physics (NCERT)", diff="EASY", year=2024)

add_gs(79, "General Science & Technology", "Space Science & Technology", "Chandrayaan-3 Landing Site",
    "India's Chandrayaan-3 achieved historic soft-landing near the lunar south pole on August 23, 2023. What official name was designated for the landing site?",
    ["Shiv Shakti Point", "Tiranga Point", "Jawahar Point", "Atal Point"],
    "A",
    "Prime Minister Narendra Modi announced that the Chandrayaan-3 lander touch-down site on the Moon is named 'Shiv Shakti Point', August 23 was designated 'National Space Day', and the Chandrayaan-2 crash site was named 'Tiranga Point'.",
    ref="ISRO Mission Reports, 2023", diff="EASY", year=2024)

add_gs(80, "General Science & Technology", "Modern Computing", "Quantum Supremacy & Qubits",
    "Unlike classical computer bits that represent either 0 or 1, a quantum bit (Qubit) in quantum computing can exist in both 0 and 1 states simultaneously due to:",
    ["Quantum Superposition", "Quantum Tunneling", "Wave Diffraction", "Photoelectric Effect"],
    "A",
    "Quantum computers exploit two counter-intuitive quantum phenomena: Superposition (qubit being in linear combination of state |0⟩ and |1⟩ simultaneously) and Entanglement (instant correlated states between qubits).",
    ref="Quantum Computing Principles by Nielsen and Chuang", diff="MEDIUM", year=2023)

# --- STATE GK & NORTHEAST REGION (APSC / STATE PSC FOCUS) (81 - 90) ---
add_gs(81, "State General Knowledge (Assam & NE)", "Assam History", "Ahom Kingdom Founder",
    "Chaolung Sukapha, the founding monarch of the Ahom Kingdom that ruled the Brahmaputra valley for six centuries, crossed the Patkai hills into Assam in:",
    ["1228 AD", "1206 AD", "1336 AD", "1526 AD"],
    "A",
    "Chaolung Sukapha, a Tai prince from Mong Mao, led his followers across the Patkai mountain range into the upper Brahmaputra valley in 1228 AD and established his first permanent royal capital at Charaideo in 1253 AD.",
    ref="A History of Assam by Sir Edward Gait", diff="EASY", year=2024)

add_gs(82, "State General Knowledge (Assam & NE)", "Assam History", "Battle of Saraighat 1671",
    "The legendary Battle of Saraighat (1671), celebrated for naval guerrilla tactics on the Brahmaputra river where the Ahom army decisively defeated Mughal forces under Ram Singh, was commanded by:",
    ["Lachit Borphukan", "Atan Burhagohain", "Chilarai", "Badan Chandra Borphukan"],
    "A",
    "Ahom General Lachit Borphukan famously commanded the Ahom forces at the Battle of Saraighat in 1671. His supreme dedication is immortalized by his proverb: 'My uncle is not greater than my country' (Dekhotkoi momai dangor nohoi).",
    ref="Comprehensive History of Assam by H.K. Barpujari", diff="EASY", year=2024)

add_gs(83, "State General Knowledge (Assam & NE)", "Assam History", "Treaty of Yandaboo 1826",
    "The historic Treaty of Yandaboo, which concluded the First Anglo-Burmese War and marked the formal beginning of British colonial administration in Assam, was signed on:",
    ["February 24, 1826", "August 15, 1826", "June 23, 1857", "March 12, 1832"],
    "A",
    "The Treaty of Yandaboo was signed on February 24, 1826 between General Sir Archibald Campbell on behalf of the British and Governor of Legaing Maha Min Hla Kyaw Htin of the Burmese Kingdom, ceding Assam, Manipur, and Arakan to the British.",
    ref="Political History of Assam by H.K. Barpujari", diff="EASY", year=2023)

add_gs(84, "State General Knowledge (Assam & NE)", "Assam Geography", "Brahmaputra Tributaries",
    "Which of the following major rivers is a NORTH-BANK tributary of the Brahmaputra River in Assam?",
    ["Subansiri", "Dhansiri", "Kopili", "Diphlu"],
    "A",
    "North-bank tributaries of the Brahmaputra include Subansiri, Jia Bharali (Kameng), Manas, Beki, Sankosh, and Puthimari. South-bank tributaries include Burhi Dihing, Disang, Dikhow, Dhansiri, and Kopili.",
    ref="Geography of Assam by Dr. H.P. Das", diff="EASY", year=2024)

add_gs(85, "State General Knowledge (Assam & NE)", "Assam Ecology", "Number of National Parks in Assam",
    "Following the notification of Raimona and Dihing Patkai in 2021, Assam currently has how many designated National Parks?",
    ["7 National Parks", "5 National Parks", "6 National Parks", "8 National Parks"],
    "A",
    "Assam boasts 7 National Parks: 1. Kaziranga, 2. Manas, 3. Nameri, 4. Orang, 5. Dibru-Saikhowa, 6. Raimona National Park (Kokrajhar), and 7. Dihing Patkai National Park (Dibrugarh-Tinsukia). This gives Assam the third highest count in India after Madhya Pradesh and Andaman & Nicobar.",
    ref="Assam Forest Department Official Notification", diff="EASY", year=2024)

add_gs(86, "State General Knowledge (Assam & NE)", "Wildlife & Ecology", "Kaziranga National Park Rhinos",
    "Kaziranga National Park, inscribed as a UNESCO World Heritage Site in 1985, hosts approximately what fraction of the world's total population of the Great Indian One-Horned Rhinoceros (Rhinoceros unicornis)?",
    ["Two-thirds (around 70%)", "One-third", "Half (50%)", "95%"],
    "A",
    "Kaziranga National Park is home to over 2,600 one-horned rhinos, representing more than two-thirds of the planet's surviving population.",
    ref="Kaziranga Wildlife Census Reports", diff="EASY", year=2023)

add_gs(87, "State General Knowledge (Assam & NE)", "Geography & Culture", "Majuli River Island",
    "Majuli, which became India's first river island district in 2016, is situated between the Brahmaputra River and which tributary channel to its north?",
    ["Kherkutia Xuti (joining Subansiri)", "Barak River", "Dhansiri", "Manas"],
    "A",
    "Majuli is bounded by the Brahmaputra River to the south and south-west and by the Subansiri River and Kherkutia Xuti (an anabranch of the Brahmaputra) to the north. It is the spiritual epicenter of Srimanta Sankaradeva's Neo-Vaishnavite Satra culture.",
    ref="Majuli District Administration", diff="MEDIUM", year=2024)

add_gs(88, "State General Knowledge (Assam & NE)", "Culture & Festivals", "Bihu Festivals Cycle",
    "In the Assamese cultural calendar, which Bihu marks the onset of the Assamese New Year and spring seeding season, celebrated with joyous Bihu dance and Dhol beats?",
    ["Rongali (Bohag) Bihu", "Kongali (Kati) Bihu", "Bhogali (Magh) Bihu", "Kati Bihu"],
    "A",
    "Rongali or Bohag Bihu (in mid-April) marks the vernal equinox and Assamese New Year celebration with music and feasting. Kongali (Kati) Bihu in October is a somber observance of prayer for crops; Bhogali (Magh) Bihu in January is the harvest feast with Mejis.",
    ref="Folk Culture of Assam by Dr. B.K. Barua", diff="EASY", year=2024)

add_gs(89, "State General Knowledge (Assam & NE)", "Assam Economy", "Discovery of Assam Tea",
    "Who is historically credited with the discovery of the indigenous wild Camellia sinensis var. assamica tea plant growing in upper Assam in 1823 with the assistance of Singpho Chief Bessa Gam?",
    ["Robert Bruce", "Lord Bentinck", "David Scott", "Nathaniel Wallich"],
    "A",
    "Major Robert Bruce, a Scottish adventurer and merchant, noticed wild tea plants in 1823 near Sivasagar through Singpho chief Bessa Gam. His brother Charles Alexander Bruce subsequently cultivated the first tea nurseries.",
    ref="The Tea Industry in India by P. Griffiths", diff="EASY", year=2023)

add_gs(90, "State General Knowledge (Assam & NE)", "Industry & Resources", "Digboi Oil Refinery",
    "The Digboi Refinery in upper Assam, which commenced commercial operations in 1901 and holds the distinction of being Asia's oldest operating oil refinery, is operated by:",
    ["Indian Oil Corporation Limited (IOCL)", "Oil and Natural Gas Corporation (ONGC)", "Oil India Limited (OIL)", "Bharat Petroleum (BPCL)"],
    "A",
    "Crude oil was discovered in Digboi in 1889 by the Assam Railways and Trading Company (AR&T). The Digboi refinery was commissioned in December 1901 by the Assam Oil Company, and is today operated by the Assam Oil Division of Indian Oil Corporation Limited (IOCL).",
    ref="IOCL Digboi Heritage Archives", diff="EASY", year=2024)

# --- QUANTITATIVE APTITUDE & LOGICAL REASONING (91 - 100) ---
add_gs(91, "Quantitative Aptitude & Reasoning", "Number Systems", "Divisibility Rule for 11",
    "If the seven-digit number 5432A71 is completely divisible by 11, what is the value of single digit A?",
    ["6", "4", "5", "8"],
    "A",
    "Divisibility rule for 11 states that the difference between the sum of digits at odd places and even places must be 0 or a multiple of 11. Sum of odd places (from right): 1 + A + 3 + 5 = 9 + A. Sum of even places: 7 + 2 + 4 = 13. Setting (13) - (9 + A) = 0 => 4 - A = 0 => A = 4? Wait: Let's check: odd places from right: 1st digit=1, 3rd=A, 5th=3, 7th=5 => 1+A+3+5 = 9+A. Even places: 2nd digit=7, 4th=2, 6th=4 => 7+2+4=13. 9+A - 13 = A - 4 = 0 => A = 4. Let's make options: A is 4, B is 6, C is 5, D is 8. Correct is B (6)? If A=4: 5432471 / 11 = 493861.0. If A=4 it is divisible. Let's fix correct to 4.",
    formula="|Sum(odd places) - Sum(even places)| is 0 or multiple of 11", diff="EASY", year=2024)

# Let's adjust Q91 options so correctOption 'A' matches 4:
gs_questions[-1]["options"] = [{"id": "A", "text": "4"}, {"id": "B", "text": "6"}, {"id": "C", "text": "5"}, {"id": "D", "text": "8"}]
gs_questions[-1]["correctOption"] = "A"
gs_questions[-1]["explanation"] = "Sum of digits in odd places (1st, 3rd, 5th, 7th from right): 1 + A + 3 + 5 = 9 + A. Sum of digits in even places (2nd, 4th, 6th): 7 + 2 + 4 = 13. For divisibility by 11: (13) - (9 + A) = 0 => 4 - A = 0 => A = 4. Checking: 5432471 / 11 = 493,861."

add_gs(92, "Quantitative Aptitude & Reasoning", "Percentages", "Successive Percentage Change",
    "A trader marks up the price of an article by 20% and then offers a discount of 10% on the marked price. What is his net percentage gain?",
    ["8% gain", "10% gain", "12% gain", "5% gain"],
    "A",
    "Using successive percentage formula: Net Change = a + b + (a · b) / 100 = (+20) + (-10) + (20 · -10) / 100 = 10 - 2 = +8% net profit. Alternatively, let CP = 100. MP = 120. SP = 120 - 12 = 108. Profit = 8%.",
    formula="Net % = a + b + (a · b) / 100", diff="EASY", year=2023)

add_gs(93, "Quantitative Aptitude & Reasoning", "Profit & Loss", "Single Equivalent Discount",
    "What single discount percentage is equivalent to two successive discounts of 20% and 10%?",
    ["28%", "30%", "25%", "18%"],
    "A",
    "Equivalent Discount = d1 + d2 - (d1 · d2 / 100) = 20 + 10 - (20 · 10 / 100) = 30 - 2 = 28%. If marked price is Rs 100, after 20% discount price is Rs 80; 10% discount on Rs 80 reduces price by Rs 8 to Rs 72. Total discount = 100 - 72 = Rs 28 (28%).",
    formula="D_eq = d1 + d2 - (d1 · d2 / 100)", diff="EASY", year=2024)

add_gs(94, "Quantitative Aptitude & Reasoning", "Simple & Compound Interest", "Two-Year CI-SI Difference",
    "The difference between compound interest and simple interest on a certain principal sum P at 10% per annum for 2 years is Rs 150. What is the principal sum P?",
    ["Rs 15,000", "Rs 12,000", "Rs 18,000", "Rs 20,000"],
    "A",
    "For 2 years, the difference between CI and SI is given by: D = P · (R / 100)² => 150 = P · (10 / 100)² => 150 = P · (1/100) => P = 150 · 100 = Rs 15,000.",
    formula="CI - SI (2 years) = P · (R / 100)²", diff="MEDIUM", year=2024)

add_gs(95, "Quantitative Aptitude & Reasoning", "Ratio & Alligation", "Rule of Alligation",
    "In what ratio must tea worth Rs 60 per kg be mixed with tea worth Rs 65 per kg so that the resulting mixture is worth Rs 62 per kg?",
    ["3 : 2", "2 : 3", "4 : 1", "5 : 2"],
    "A",
    "By rule of alligation: Quantity of Cheaper / Quantity of Dearer = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price) = (65 - 62) / (62 - 60) = 3 / 2. Therefore the required mixing ratio is 3 : 2.",
    formula="Ratio = (Price2 - Mean) / (Mean - Price1)", diff="EASY", year=2022)

add_gs(96, "Quantitative Aptitude & Reasoning", "Time and Work", "Combined Work Efficiency",
    "A can complete a piece of civil drafting work in 12 days, and B can complete the same work in 24 days. Working together, how many days will they take to finish the work?",
    ["8 days", "6 days", "10 days", "9 days"],
    "A",
    "Combined rate per day = 1/12 + 1/24 = (2 + 1) / 24 = 3/24 = 1/8 of total work. Hence together they complete the entire work in 1 / (1/8) = 8 days. Shortcut: (A · B) / (A + B) = (12 · 24) / 36 = 288 / 36 = 8 days.",
    formula="Time = (A · B) / (A + B)", diff="EASY", year=2024)

add_gs(97, "Quantitative Aptitude & Reasoning", "Time, Speed & Distance", "Relative Speed of Trains",
    "Two trains 140 m and 160 m long are running towards each other on parallel tracks at speeds of 60 km/h and 48 km/h respectively. In how many seconds will they completely cross each other?",
    ["10 seconds", "12 seconds", "15 seconds", "8 seconds"],
    "A",
    "Total distance to cross = sum of lengths = 140 + 160 = 300 m. Since moving in opposite directions, Relative Speed = 60 + 48 = 108 km/h = 108 · (5/18) = 30 m/s. Time to cross = Distance / Relative Speed = 300 / 30 = 10 seconds.",
    formula="Time = (L1 + L2) / (S1 + S2)", diff="MEDIUM", year=2023)

add_gs(98, "Quantitative Aptitude & Reasoning", "Averages", "Average Age with Inclusion",
    "The average age of 24 students in a study group is 15 years. When the teacher's age is included, the average increases by 1 year. What is the teacher's age?",
    ["40 years", "38 years", "42 years", "35 years"],
    "A",
    "Total age of 24 students = 24 · 15 = 360 years. When teacher is added, total persons = 25 and new average = 16 years. Total age = 25 · 16 = 400 years. Teacher's age = 400 - 360 = 40 years. Shortcut: New Member Age = Old Average + New Count · Increase = 15 + 25 · 1 = 40 years.",
    formula="New Member Age = Old Avg + (Total Count · Change)", diff="EASY", year=2024)

add_gs(99, "Quantitative Aptitude & Reasoning", "Logical Reasoning", "Syllogism Deductions",
    "Statements: (1) All engineers are graduates. (2) Some graduates are researchers. Conclusions: I. Some researchers are graduates. II. All engineers are researchers. Which conclusion(s) logically follow?",
    ["Only Conclusion I follows", "Only Conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
    "A",
    "Statement 2 'Some graduates are researchers' immediately converts to 'Some researchers are graduates' (Conclusion I is valid). There is no middle term distribution guaranteeing that all engineers are researchers, so Conclusion II does not follow.",
    ref="Verbal Reasoning by R.S. Aggarwal", diff="EASY", year=2023)

add_gs(100, "Quantitative Aptitude & Reasoning", "Logical Reasoning", "Number Series Progression",
    "What is the next number in the logical sequence: 3, 7, 15, 31, 63, ?",
    ["127", "125", "128", "120"],
    "A",
    "Pattern: Each number is obtained by multiplying the previous number by 2 and adding 1 (2n + 1), or adding successive powers of 2 (+4, +8, +16, +32, +64). Hence next number = 63 · 2 + 1 = 126 + 1 = 127 (or 63 + 64 = 127).",
    formula="an = 2 · an-1 + 1", diff="EASY", year=2024)

print(f"Total GS Questions defined: {len(gs_questions)}")

ts_content = f"""import {{ MCQQuestion }} from '../types';

/**
 * Complete Bank of 100 AI-Calibrated Questions for General Studies (Paper I)
 * Modeled after Testbook, UPSC Civil Services & State PSC (APSC CCE) Standards.
 */
export const GENERAL_STUDIES_QUESTIONS: MCQQuestion[] = {json.dumps(gs_questions, indent=2, ensure_ascii=False)};
"""

with open('src/data/generalStudiesQuestions.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Saved src/data/generalStudiesQuestions.ts successfully!")
