exports.up = function(knex, Promise) {
    return knex.raw(`CREATE OR REPLACE FUNCTION downloads() RETURNS TABLE(dataset text[], count bigint)
 AS $$ select regexp_matches(endpoint, '\/datasets\/(.+)\/download')as dataset, count(*)from statistic where resource = 'Dataset' group by regexp_matches(endpoint, '\/datasets\/(.+)\/download')order by count(*)desc $$ LANGUAGE SQL;
    `)
};

exports.down = function(knex, Promise) {};
