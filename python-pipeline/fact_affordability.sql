insert into fact_affordability(location_id,name,month,year,affordability_value)
select
    h.location_id,
    h.name,
    h.month,
    h.year,
    h.price / i.income as affordability_value
from fact_housing as h 
left join
    fact_income as i 
    on h.location_id = i.location_id
    and h.year = i.year
where h.year >= 2000
ON CONFLICT (location_id, year, month)
DO UPDATE SET
    affordability_value = EXCLUDED.affordability_value,
    name = EXCLUDED.name;

