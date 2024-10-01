const supabase = require('../../config.js');

exports.handler = async (event) =>{
      const { match_id } = event.queryStringParameters;
    
      if (!match_id) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
          },
          body: JSON.stringify({ error: 'match_id is required' }),
        };
      }
    
      // Obtener el partido y los equipos
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('team1_id, team2_id')
        .eq('match_id', match_id)
        .single();
    
      if (matchError || !match) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
          },
          body: JSON.stringify({ error: `Match not found for match_id: ${match_id}` }),
        };
      }
    
      const { team1_id, team2_id } = match;

        console.log("Team 1 ID:", team1_id);
        console.log("Team 2 ID:", team2_id);

    
      // Obtener los jugadores de ambos equipos
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .or(`team_id.eq.${team1_id},team_id.eq.${team2_id}`);

        console.log(players);

      if (playersError) {
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
          },
          body: JSON.stringify({ error: 'Error fetching players' }),
        };
      }
    
      // Obtener las estadísticas de los jugadores en el match
      const { data: stats, error: statsError } = await supabase
        .from('players_matches_stats')
        .select('*')
        .eq('match_id', match_id);
    
      if (statsError) {
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
          },
          body: JSON.stringify({ error: `Error fetching player stats: ${statsError.message}` }),
        };
      }
    
      // Combinar jugadores con sus estadísticas
      const playersWithStats = players.map(player => {
        const playerStats = stats.find(stat => stat.player_id === player.player_id) || {
          points: 0,
          assists: 0,
          rebounds: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          fouls: 0,
          fga: 0,
          fgm: 0,
          threepta: 0,
          threeptm: 0,
          fta: 0,
          ftm: 0,
        };
        return {
          player_id: player.player_id,
          player_name: player.player_name,
          team_id: player.team_id,
          ...playerStats,
        };
      });
    
      return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
          },
        body: JSON.stringify({
          team1Players: playersWithStats.filter(p => p.team_id === team1_id),
          team2Players: playersWithStats.filter(p => p.team_id === team2_id),
        }),
      };
    };