# Math books
SELECT 
    deweyClass,
    title,
    COUNT(cout) AS checktimes,
    YEAR(cout) AS years,
    MONTH(cout) AS months,
    DAY(cout) AS days
FROM
    spl_2016.outraw
WHERE
    (itemtype LIKE '%bk')
        AND (deweyClass != ' ')
        AND (deweyClass != '')
        AND (deweyClass BETWEEN 000 AND 006)
        AND ((LOWER(title) LIKE '%python%')
        OR (LOWER(title) LIKE '%c++%')
        OR (LOWER(title) LIKE '% c %')
        OR (LOWER(title) LIKE '%swift%')
        OR (LOWER(title) LIKE '%c#%')
        OR (LOWER(title) LIKE '%javascript%')
        OR (LOWER(title) LIKE '%java%')
        OR (LOWER(title) LIKE '%php%')
        OR (LOWER(title) LIKE '%cpp%')
        OR (LOWER(title) LIKE '% sql %')
        OR (LOWER(title) LIKE '%kotlin%')
        OR (LOWER(title) LIKE '%ruby%'))
GROUP BY deweyClass , title , years , months, days
ORDER BY years , months, days ASC