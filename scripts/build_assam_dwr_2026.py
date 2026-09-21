# -*- coding: utf-8 -*-
"""
Full generation script for 100 Assam DWR 2026 Paper II Questions (11/01/2026).
Code: EAM/DWR/II/25/11/43-A (Series A)
General Studies and General English
"""
import json
import os

questions = [
    {
        "num": 1,
        "subject": "General Studies",
        "topic": "Ancient Indian History & Philosophy",
        "subtopic": "Jainism",
        "stem": "Jain philosophy is known as",
        "options": ["Pudgala", "Samkhya", "Samachari", "Syadvada"],
        "ans": "D",
        "explanation": "Syadvada (the doctrine of conditioned predication or 'maybe') along with Anekantavada (pluralism of reality) forms the central philosophical and epistemological foundation of Jain philosophy. Pudgala denotes matter in Jain cosmology, while Samkhya is one of the six orthodox Hindu philosophical systems.",
        "ref": "Ancient Indian Philosophy - NCERT History Class XI / Satish Chandra",
        "diff": "EASY",
        "type": "CONCEPTUAL"
    },
    {
        "num": 2,
        "subject": "General Studies",
        "topic": "Ancient Indian History & Philosophy",
        "subtopic": "Buddhist Literature",
        "stem": "Match the following :\na. Buddhacharita        1. Nagasena\nb. Sutralankara         2. Ashvaghosha\nc. Milinda Panha        3. Nagarjuna\nd. Madhyamika Karika    4. Asanga\n\nSelect the correct answer using the codes given below.",
        "options": [
            "a-1, b-2, c-4, d-3",
            "a-3, b-1, c-2, d-4",
            "a-2, b-4, c-1, d-3",
            "a-4, b-3, c-2, d-1"
        ],
        "ans": "C",
        "explanation": "• Buddhacharita was composed in Sanskrit by Ashvaghosha (a-2).\n• Mahayanasutralamkara (Sutralankara) was authored by Asanga (b-4).\n• Milinda Panha records dialogues between King Menander I and Buddhist monk Nagasena (c-1).\n• Mulamadhyamakakarika (Madhyamika Karika) was authored by Nagarjuna (d-3).\nHence, the correct matching code is (C) a-2, b-4, c-1, d-3.",
        "ref": "Ancient Indian Literature - R.S. Sharma",
        "diff": "MEDIUM",
        "type": "CONCEPTUAL"
    },
    {
        "num": 3,
        "subject": "General Studies",
        "topic": "Ancient Indian History",
        "subtopic": "Mauryan Epigraphy",
        "stem": "Rummindei Pillar of Ashoka is put up to mark Buddha's",
        "options": ["birth place", "enlightenment", "first sermon", "death"],
        "ans": "A",
        "explanation": "The Rummindei Pillar Inscription at Lumbini (present-day Nepal) was erected by Mauryan Emperor Ashoka in his 20th regnal year to commemorate the birthplace of Gautama Buddha. Ashoka exempted the village of Lumbini from religious taxes (Bali) and reduced land revenue (Bhaga) to one-eighth.",
        "ref": "Ashokan Inscriptions - Romila Thapar",
        "diff": "EASY",
        "type": "CONCEPTUAL"
    },
    {
        "num": 4,
        "subject": "General Studies",
        "topic": "Ancient Indian History & Literature",
        "subtopic": "Harshavardhana Era",
        "stem": "Harshacharita was written by",
        "options": ["Kautilya", "Hiuen Tsang", "Aryabhata", "Banabhatta"],
        "ans": "D",
        "explanation": "Harshacharita is the Sanskrit biography of King Harshavardhana of Kannauj, authored by his court poet (Asthana Kavi) Banabhatta in the 7th century CE. Banabhatta is also renowned for his romantic prose work Kadambari.",
        "ref": "NCERT Class XI History / Banabhatta's Harshacharita",
        "diff": "EASY",
        "type": "CONCEPTUAL"
    },
    {
        "num": 5,
        "subject": "General Studies",
        "topic": "Modern Indian History",
        "subtopic": "British Legal System & Law Commissions",
        "stem": "In 1838, the Government appointed a Law Commission to codify Indian Law. The Commission was headed by",
        "options": ["Lord Macaulay", "Warren Hastings", "Lord Ripon", "Lord Cornwallis"],
        "ans": "A",
        "explanation": "The First Law Commission of India was established under the Charter Act of 1833 and presided over by Thomas Babington Macaulay (Lord Macaulay). The commission drafted the Indian Penal Code (IPC), submitted in 1837 and printed in 1838.",
        "ref": "Constitutional & Legal History of India - M.P. Jain",
        "diff": "MEDIUM",
        "type": "CONCEPTUAL"
    },
    {
        "num": 6,
        "subject": "General Studies",
        "topic": "Socio-Religious Reform Movements",
        "subtopic": "Reformers of South India",
        "stem": "\"One religion, one caste, one God for mankind\" was the famous slogan of",
        "options": ["Swami Vivekananda", "B. R. Ambedkar", "Sree Narayana Guru", "Rabindranath Tagore"],
        "ans": "C",
        "explanation": "Sree Narayana Guru, the visionary philosopher and social reformer of Kerala who led the SNDP Yogam movement against caste oppression, coined the immortal motto: 'Oru Jathi, Oru Matham, Oru Daivam Manushyanu' (One caste, one religion, one God for mankind).",
        "ref": "Modern Indian Social Reform - Bipan Chandra",
        "diff": "EASY",
        "type": "CONCEPTUAL"
    },
    {
        "num": 7,
        "subject": "Assam History & Culture",
        "topic": "Assam Art, Culture & Literature",
        "subtopic": "Illustrated Manuscripts",
        "stem": "The illustration work of the medieval Assamese text, Hastividyarnava was done by",
        "options": ["Dibar and Dosai", "Rama Saraswati", "Sukumar Barkaith", "Suryakhan Daibegya"],
        "ans": "A",
        "explanation": "Hastividyarnava (Treatise on Elephants) was compiled in 1734 CE by court poet Sukumar Borkaith under the orders of Ahom King Siva Singha and Queen Ambika. The exquisite paintings and miniatures were illustrated by two court artists from Rajputana/Bengal named Dilbar (Dibar) and Dosai.",
        "ref": "A Comprehensive History of Assam - S.L. Baruah / Edward Gait",
        "diff": "MEDIUM",
        "type": "CONCEPTUAL"
    },
    {
        "num": 8,
        "subject": "General Studies",
        "topic": "Indian Art & Architecture",
        "subtopic": "Chola Architecture",
        "stem": "Brihadeshwara Temple at Tanjore was built by",
        "options": ["Rajaraja I", "Rajaraja II", "Chandragupta Maurya", "Rajendra Chola"],
        "ans": "A",
        "explanation": "The magnificent Brihadeshwara Temple (Peruvudaiyar Kovil) at Thanjavur (Tanjore) was constructed between 1003 and 1010 CE by the Chola Emperor Rajaraja I. Dedicated to Lord Shiva, it is a hallmark of Dravidian architecture and a UNESCO World Heritage Site.",
        "ref": "NCERT Fine Arts Class XI / Indian Architecture - Percy Brown",
        "diff": "EASY",
        "type": "CONCEPTUAL"
    },
    {
        "num": 9,
        "subject": "Assam History & Culture",
        "topic": "Assam History",
        "subtopic": "Chronology of Early Ahom Kings",
        "stem": "Arrange the following Ahom rulers in chronological order :\n(i) Sukapha\n(ii) Subinpha\n(iii) Suteupha\n(iv) Sukhangpha\n\nSelect the correct answer from the following.",
        "options": [
            "(i), (ii), (iii), (iv)",
            "(i), (iii), (ii), (iv)",
            "(iii), (i), (ii), (iv)",
            "(ii), (iii), (i), (iv)"
        ],
        "ans": "B",
        "explanation": "The chronological reign of early Ahom Swargadeos:\n1. Chaolung Sukaphaa (1228–1268 CE)\n2. Suteuphaa (1268–1281 CE)\n3. Subinphaa (1281–1293 CE)\n4. Sukhangphaa (1293–1332 CE)\nTherefore, the correct chronological order is (i), (iii), (ii), (iv) -> Option (B).",
        "ref": "A History of Assam - Sir Edward Gait",
        "diff": "MEDIUM",
        "type": "CONCEPTUAL"
    },
    {
        "num": 10,
        "subject": "General Studies",
        "topic": "Medieval Indian History",
        "subtopic": "Akbar's Administration & Conquests",
        "stem": "Arrange the following in chronological order :\n(i) Conquest of Orissa by Akbar\n(ii) Introduction of Dagh system\n(iii) Creation of the twelve Subahs (Provinces)\n(iv) Introduction of the dual rank (Zat and Sawar)\n\nSelect the correct answer from the following.",
        "options": [
            "(iii), (i), (ii), (iv)",
            "(i), (iii), (iv), (ii)",
            "(ii), (iii), (i), (iv)",
            "(iii), (iv), (i), (ii)"
        ],
        "ans": "C",
        "explanation": "• Introduction of Dagh (horse branding) and Chehra system: 1573–74 CE (18th regnal year).\n• Administrative division of empire into 12 Subahs: 1580 CE.\n• Annexation and conquest of Orissa by Raja Man Singh: 1590–1592 CE.\n• Formal introduction of dual rank (Zat and Sawar) in the Mansabdari system: 1595–1596 CE.\nHence, the correct sequence is (ii), (iii), (i), (iv) -> Option (C).",
        "ref": "Medieval India - Satish Chandra",
        "diff": "HARD",
        "type": "CONCEPTUAL"
    }
]

print(f"Loaded initial {len(questions)} questions")
