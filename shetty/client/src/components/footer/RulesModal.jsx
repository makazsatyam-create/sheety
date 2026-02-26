import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const TEAL_LIGHT = "#04a0e2";
const CYAN = "#01fafe";
const rules = [
  {
    title: "Deposit Bonus",
    content: {
      sections: [
        {
          text: "DEPOSIT BONUS = 5% IMPS Deposit (APPLIED FOR EVERY IMPS DEPOSIT)",
        },
        { text: "PAYMENT METHOD = BANK TRANSFER (IMPS)" },
        { text: "MAX. BONUS = 500" },
        { text: "TURNOVER = 3X ROLLING ON DEPOSIT AMOUNT" },
        { text: "CATEGORIES APPLIED = SPORTS [CRICKET]" },
        { text: "EXPIRY DAYS= 7" },
        {
          text: "NOTE = ROLLING WILL BE APPLICABLE ONLY ON EXCHANGE'S CRICKET MATCHES.",
        },
        {
          text: "(NOT APPLICABLE ON SPORTSBOOK AND PREMIUM MARKETS)",
          italic: true,
        },
      ],
    },
  },

  {
    title: "Deposit Wagering",
    content: {
      sections: [
        { text: "All the deposits require 50% wagering" },
        {
          text: "e.g: If you deposit 100 then required wagering = 50",
        },
        {
          text: "Please refer to Deposit turnover report for progress of wagering on each deposit.",
        },
      ],
    },
  },
  {
    title: "Deposit Limits",
    content: {
      sections: [{ text: "Minimum deposit amount : ₹500 /-" }],
    },
  },
  {
    title: "Withdraw Limits",
    content: {
      sections: [
        { text: "Any withdrawal below ₹100 is not allowed." },
        {
          text: "-> If the balance is greater than ₹500 -> Minimum withdrawal amount : ₹500 /- .",
        },
        {
          text: "-> If the balance is less than or equal to 500, Minimum withdrawal amount : Available balance .",
        },
        { text: "You can withdraw only 4 times in a day." },
      ],
    },
  },
  {
    title: "Football Fancy",
    content: {
      sections: [
        {
          text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example in case of vpn/robot-use/multiple entry from same IP/ multiple bets at same time (Punching) and others.",
        },
        { text: "Note : only winning bets will be voided.", italic: true },
        {
          text: "Tournament Total Goals, Team Total Goals goals.scored in 90 minutes or in extra-time will count. Goals scored in penalty shootouts do not count.",
        },
        {
          text: "Tournament Corners - Only corners taken in 90 minutes count.",
        },
        {
          text: "Tournament Penalties Missed/Converted - Penalties taken in 90 minutes, extra-time and penalty shootouts all count.",
        },
        {
          text: "If a penalty has to be re-taken the previous disallowed penalty(ies) do not count.",
        },
      ],
    },
  },
  {
    title: "Big Bash League",
    content: {
      sections: [
        {
          text: "- If BBL fixture of 44 matches gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this)",
        },
        {
          text: "- At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid",
        },
        { text: "1. Highest Innings run - Only First Innings is Valid" },
        { text: "2. Lowest Innings run - Only First Innings is Valid" },
        {
          text: "3. Highest Total Runs in Single Match of BBL: Maximum Runs Scored by 2 Teams in Single Match.",
        },
        {
          text: "4. Largest Margin Win by Runs of BBL : Maximum Runs Margin Win by Any Team. Example : PS 210 in 1st Inn and SS 150 in 2nd Inn Means PS Win by 60 run Margin.",
        },
        { text: "5. Highest Partnership Runs in BBL: Both Innings are Valid" },
        { text: "6. Highest Partnership Balls in BBL: Both Innings are Valid" },
        {
          text: "7. Highest Partnership Boundaries in BBL: Both Innings are Valid",
        },
        {
          text: "8. In fastest fifty always the first 50 runs will be considered, for example of S Smith scores 1st fifty in 17 balls and scores 100 in next 14 balls, fastest 50 will be given based on the balls for the 1st fifty runs",
        },
        {
          text: "9. Highest Run Scorer Runs : Total Runs Scored by An Individual Batsman in Full Tournament (BBL GOLDEN BAT)",
        },
        {
          text: "10. Highest Wicket Taker Wickets: Total Wickets Taken by a Bowler in Full Tournament (BBL GOLDEN ARM)",
        },
        {
          text: "11. How Many time 5 or More Wickets taken by Bowlers : Number of time 5 or More Wickets taken by Bowlers. In Case Same Bowler 2 time 5 or More Wickets taken means Result Counted as 2.",
        },
        {
          text: "12. Total 1st Over Runs : Average 6 Runs will be given in case match abandoned or over reduced. 1st Inn Match 1st Over Runs Only Considered",
        },
        {
          text: "13. Total 4's: Average 26 Fours will be given in case match abandoned or over reduced",
        },
        {
          text: "14. Total 6's: Average 12 Sixes will be given in case match abandoned or over reduced",
        },
        {
          text: "15. Total Boundaries: Average 38 Boundaries will be given in case match abandoned or over reduced",
        },
        {
          text: "16. Total Wickets - Average will 13 Wickets be given in case match abandoned or over reduced",
        },
        {
          text: "17. Total Wides - Average 8 Wides will be given in case match abandoned or over reduced",
        },
        {
          text: "18. Total Extras - Average 16 Extras will be given in case match abandoned or over reduced",
        },
        {
          text: "19. Total Caught outs: Average 9 Caught out will be given in case match abandoned or over reduced",
        },
        {
          text: "20. Total Bowled:- Average 2 Bowled out will be given in case match abandoned or over reduced",
        },
        {
          text: "21. Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced",
        },
        {
          text: "22. Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced",
        },
        {
          text: "23. Total 30's: Average 3 Thirties will be given in case match abandoned or over reduced",
        },
        {
          text: "24. Total 50's: Average 1 Fifties will be given in case match abandoned or over reduced",
        },
        {
          text: "25. Total Duckouts in BBL : Average 1 Duckout will be given in case match abandoned or over reduced",
        },
        {
          text: "26. Total Single Digit Scorers in BBL : Average 6 Single Digit Scorers will be given in case match abandoned or over reduced.Duck outs Not Considered in this Event. If Not out Batsman/Injured Batsman facing One Legal Delivery and nothing scored ('0') means Considered as Single Digit",
        },
        {
          text: "27. Total Double Digit Scorers in BBL : Average 9 Double Digit Scorers will be given in case match abandoned or over reduced",
        },
        {
          text: "28. Total Players Facing 25 plus Balls in BBL : Average 3 Players will be given in case match abandoned or over reduced",
        },
        {
          text: "29. Total Impact Overs in BBL : Average 14 Impact Over will be given in case match abandoned or over reduced.Number of over's scored 10 runs and above. If a team all out or Match Resulted in 15.2 then considered as 16 over.",
        },
        {
          text: "30. Total No Boundaries Overs in BBL : Average 14 No Boundaries Over will be given in case match abandoned or over reduced.If Match Resulted in 2nd Inn 17 Overs Means How Many Overs Boundaries not Came in that 37 Overs Only Considered.Balance 3 Overs not Considered in this.",
        },
        {
          text: "31. Total Four Hitters in BBL : Average 9 Four Hitter will be given in case match abandoned or over reduced",
        },
        {
          text: "32. Total Six Hitters in BBL : Average 6 Six Hitter will be given in case match abandoned or over reduced",
        },
        {
          text: "33. Total Wicket Takers in BBL : Average 7 Wicket Taker will be given in case match abandoned or over reduced",
        },
        {
          text: "34. Total Bowler Giving 30plus Runs in BBL : Average 5 Bowlers will be given in case match abandoned or over reduced",
        },
        {
          text: "35. Total Highest Scoring Over Runs in BBL: Total of Every Match Highest Scoring Over Runs. Average 20 Runs will be given in case match abandoned or over reduced.",
        },
        {
          text: "36. Highest Match 1st Over Run of BBL : Only First Innings is Valid.",
        },
        {
          text: "37. Highest 1st 6 over run: Only First Innings is Valid.Will not consider if over reduce before completion 6 over.",
        },
        {
          text: "38. Highest 1st 10 over run : Only First Innings is Valid.Will not consider if over reduce before completion 10 over.",
        },
        {
          text: "39. Highest 4s,6s,Boundaries,Wickets,Wides,Extras,Caught Outs,Bowled,Lbw, Runouts,30s,50s, Duckouts,Single Digit Scorers, Double Digit Scorers,Players 25+ balls, Impact Overs, Noboundary Overs,Four Hitter,Six Hitter,Wicket Takers and Bowler 30+ Runs in individual match: All Both Innings are Counted.",
        },
        {
          text: "40. Highest Scoring Over Runs in BBL: Both Innings are Valid",
        },
        {
          text: "41. Most Balls Faced By a Batsman of BBL : Maximum balls Faced by an Individual Batsman in the Single Match.",
        },
        {
          text: "42. Most 4's by a Batsman in an Inn of BBL : Maximum 4s Hitted by an Individual Batsman in any Single Match",
        },
        {
          text: "43. Most 6's by a Batsman in an Inn of BBL : Maximum 6s Hitted by an Individual Batsman in any Single Match",
        },
        {
          text: "44. Most Boundaries Given by a Bowler in an Inn of BBL : Maximum Boundaries Conceded By Single Bowler in His 4 Overs.",
        },
        {
          text: "45. Most Dotballs By a Bowler in an Inn of BBL : Maximum Dotballs By Single Bowler in His 4 Overs.",
        },
        {
          text: "46. Most Runs Given by Bowler in an Inning of BBL : Maximum Runs conceded by a individual Bowler in an Innings.",
        },
        {
          text: "47. Most 4s hitted by a Batsman of BBL : Maximum Fours Hitted by Single Batsman in Full Tournament.",
        },
        {
          text: "48. Most 6s hitted by a Batsman of BBL : Maximum Sixes Hitted by Single Batsman in Full Tournament.",
        },
        {
          text: "49. Most 50s Scored by a Batsman of BBL : Maximum 50s Scored by Single Batsman in Full Tournament.",
        },
        {
          text: "50. Most 4s,6s,Wide,Extras,Caught Outs,Bowled,LBW,Single Digit Scorers, Double Digit Scorers, Four Hitters,Six Hitters and Wicket Takers in an Innings Of the Match : Considered For Maximum Reached Any Innings.All Both Innings Considered as Valid",
        },
        { text: "51. Super over will not be included" },
        {
          text: "- If the match starts Over Reduced Game or 20 Over Game, after the balls are reduced due to rain interrupting means comparison Events like Highest 4s,6s, boundaries,30s,50s, Wickets,Wides,Extras,Caughtouts,Bowled,Lbw,Runout,Duckout,Single Digit Scorers, Double Digit Scorers and Most 4s,6s,boundaries,30s,50s, Caught outs,Bowled,Duckout, wicket Keeper Dismissals all are considered for Result.",
        },
        {
          text: "- Example : If a match started as 20 Overs game after rain Overs reduced to 16 Overs match, in that match Maximum 6s reached means that Value considered for Result",
        },
      ],
    },
  },
  {
    title: "Wbbl Tournament Rules",
    content: {
      sections: [
        {
          text: "If WBBL fixture of 43 matches gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this) At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid. Management decision will be final.",
        },
        { text: "1. Highest innings run - Only First innings is valid" },
        { text: "2. Highest Partnership Run: Both Innings are valid" },
        {
          text: "3. Highest Run Scorer Runs: Total Runs Scored by An Individual Batsman in Full Tournament. (WBBL Golden Bat).",
        },
        {
          text: "4. Total 4's: Average 30 Fours will be given in case match abandoned or over reduced",
        },
        {
          text: "5. Total 6's: Average 5 Sixes will be given in case match abandoned or over reduced",
        },
        {
          text: "6. Total Boundaries: Average 35 Boundaries will be given in case match abandoned or over reduced",
        },
        {
          text: "7. Total 30's: Average 2 Thirties will be given in case match abandoned or over reduced",
        },
        {
          text: "8. Total 50's: Average 1 Fifties will be given in case match abandoned or over reduced",
        },
        {
          text: "9. Total Wickets - Average will 13 Wickets be given in case match abandoned or over reduced",
        },
        {
          text: "10. Total Wides - Average 9 Wides will be given in case match abandoned or over reduced",
        },
        {
          text: "11. Total No balls:- Average 1 No ball will be given in case match abandoned or over reduced",
        },
        {
          text: "12. Total Extras - Average 16 Extras will be given in case match abandoned or over reduced",
        },
        {
          text: "13. Total Caught outs: Average 8 Caught out will be given in case match abandoned or over reduced",
        },
        {
          text: "14. Total Bowled:- Average 2 Bowled out will be given in case match abandoned or over reduced",
        },
        {
          text: "15. Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced",
        },
        {
          text: "16. Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced",
        },
        {
          text: "17. Total Duckouts : Average 1 Duckout will be given in case match abandoned or over reduced",
        },
        {
          text: "18. Total Single Digit Scorers : Average 7 Single Digit Scorers will be given in case match abandoned or over reduced. Duck outs Not Considered in this Event. If Not out Batsman/Injured Batsman facing One Legal Delivery and nothing scored ('0') means Considered as Single Digit",
        },
        {
          text: "19. Total Double Digit Scorers: Average 8 Double Digit Scorers will be given in case match abandoned or over reduced",
        },
        {
          text: "20. Total of Impact Overs : Average 10 Impact Overs will be given in case match abandoned or over reduced. Number of over's scored 10 runs and above. If a team all out or Match Resulted in 15.1 then considered as 16 over.",
        },
        {
          text: "21. Total 50+ Partnerships - Average 2 Fifty plus Partnerships will be given in case match abandoned or over reduced. 50 and 50 Above Partnerships All Counted in this.",
        },
        {
          text: "22. Highest 1st 6 over run: Both Innings are Valid. Will not consider if over reduce before completion 6 over.",
        },
        {
          text: "23. Highest 1st 10 over run : Both Innings are Valid. Will not consider if over reduce before completion 10 over.",
        },
        {
          text: "24. Highest 4s,6s,30s,50s,Wickets,Wides,Extras,Caught Outs,Bowled,Lbw,Runouts,Duckouts,Single Digit Scorers,Double Digit Scorers,50+ Pships and Imapact Overs in individual match: All Both innings are Counted.",
        },
        {
          text: "25. Highest Scoring Over Runs : Maximum Runs Scored in any Single Over in Full Tournament.",
        },
        {
          text: "26. Most 4s,6s,Boundaries,30s,50s,Wides,Extras,Caught Outs,Bowled,Duckouts and Impact Overs in an Innings Of the Match : Considered For Any Innings. All Both Innings Considered as Valid",
        },
        {
          text: "27. Most 4's by individual batsman in a Match : Maximum 4s Hitted by an Individual Batsman in any Single Match",
        },
        {
          text: "28. Most 6's by individual batsman in a Match : Maximum 6s Hitted by an Individual Batsman in any Single Match",
        },
        {
          text: "29. Most Balls Faced By a Batsman : Maximum balls Faced by an Individual Batsman in the Single Match.",
        },
        {
          text: "30. Most runs given by Bowler in an Inning : Maximum Runs conceded by a individual Bowler in an Innings.",
        },
        {
          text: "31. Most wickets by Bowler in an inning : Maximum Wickets taken by a individual Bowler in an Innings",
        },
        {
          text: "32. If the match starts as a 20 Over game, after the balls are reduced due to rain interrupting means comparison Events like Highest 4s,6s,boundaries,30s,50s,Wickets,Wides,Extras,Caughtouts,Bowled,Lbw,Runout,Duckout,Single Digit Scorers,Double Digit Scorers and Most 4s,6s,boundaries,30s,50s,Caught outs,Bowled,Duckout,wicket Keeper Dismissals all are considered for Result. Example : If a match started as 20 Overs game after rain Overs reduced to 16 Overs match, in that match Maximum 6s reached means that Value considered for Result of Highest 6s in Individual Match.",
        },
        { text: "34. Super over will not be included." },
        {
          text: "35. Lowest innings run (1st Inn) - Only First innings is valid. 1st Inning playing team must be Played 20 Overs or If team get all out means Only considered.",
        },
        { text: "36. Lowest innings run (Both Inn) - Both innings are valid." },
      ],
    },
  },
  {
    title: "Lunch Favourite",
    content: {
      sections: [
        {
          text: "The team which is favourite at lunch will be considered as lunch favourite or the team which is favourite after first inning last ball will be considered as lunch favourite in our exchange.",
        },
        { text: "In any circumstances management decision will be final." },
        {
          text: "In case of tie in T20 or one day in lunch favourite game, all bets will be deleted in our exchange.",
        },
        {
          text: "In case overs are reduced in a match, the team which favourite at lunch will be considered as lunch favourite.",
        },
        {
          text: "For example :- if match is reduced to 18 over per side in t20 or Oneday then after 18 over the team which is favourite at lunch will be considered as lunch favourite.",
        },
        {
          text: "In case of weather, 1st innings match overs are reduced and direct target is given to team which will bat in 2nd inning then lunch favourite will be considered after target is given at lunch.",
        },
        {
          text: "For example :- in T20 match rain comes at 14 over and match is interrupted due to rain and direct target is given to 2nd batting team, then team which is favourite in match odds after target is given in match, will be considered as lunch favourite.",
        },
      ],
    },
  },
  {
    title: "Bookmaker",
    content: {
      sections: [
        {
          text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at the same time (Punching) and others. Note : only winning bets will be voided...",
        },
        {
          text: "Due to any reason any team will be getting advantage or disadvantage we are not concerned.",
        },
        {
          text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at the same time (Punching) and others. Note : only winning bets will be voided.",
        },
        {
          text: "We will simply compare both teams 10 overs score higher score team will be declared winner in ODI (If both teams same score means, low wickets team will be declared winner. In case, both teams same score & same wickets means highest boundaries team will be declared winner.If all same then will be declared No result)",
        },
        {
          text: "We will simply compare both teams 6 overs higher score team will be declared winner in T20 matches (If both teams same score means, low wickets team will be declared winner. In case, both teams same score & same wickets means highest boundaries team will be declared winner.If all same then will be declared No result)",
        },
        {
          text: "Any query about the result or rates should be contacted within 7 days of the specific event, the same will not be considered valid post 7 days from the event.",
        },
        {
          text: "If two team ends up with equal points, then result will be given based on the official point table",
        },
        { text: "Tennis:- Advance fancy market" },
        {
          text: "If the second set is not completed all bets regarding this market will be voided",
        },
        {
          text: "If a player retires after completion of second set, then the market will be settled as three sets",
        },
        { text: "Virtual Cricket" },
        {
          text: "At any situation if the video gets interrupted/stopped then the same cannot be continued due to any technical issues bookmaker market will be voided",
        },
      ],
    },
  },
  {
    title: "Speed Cash Rules",
    content: {
      sections: [
        {
          text: "1. The customer is receiving plus on both selections, making him eligible for 'Speed Cash'.",
        },
        {
          text: "2. Once a customer uses 'Speed Cash', their existing book will be settled, after which they will need to place bets again by playing.",
        },
        {
          text: "3. A customer wins 110 points on player A and 100 points on player B. After deducting 3% from the smaller winning amount, the customer will use 'Speed Cash' and can add 97 points to their main balance.",
        },
        {
          text: "4. The difference between Player A winning points & Player B winning points must not be greater than 10. Ex: Player A = 110, Player B = 130 Diff = 20 which is > 10 so, this is not eligible for speed cash",
        },
        {
          text: "5. If you use 'Speed Cash' and the match result is tied or Abandoned, your main balance won't be affected.",
        },
      ],
    },
  },
  {
    title: "Politics",
    content: {
      sections: [
        { text: "Indian state legislative assembly elections." },
        {
          text: "This event is to decide the winner of various legislative assemblies of india.",
        },
        {
          text: "The final result declared by election commission of india for assembly elections of various states of india for a particular year will be valid in our exchange.",
        },
        {
          text: "The customers are entirely responsible for their bets at all times.",
        },
        {
          text: "All bets will be voided if the election doesn't take place in given time by election commission or as per our exchange management decision.",
        },
        {
          text: "Company reserves the right to suspend/void any bets on this event at any time if we find the same not to be legitimate with the certainty of the outcome.",
        },
        {
          text: "Accidental issues during assembly elections will not be counted in our exchange.",
        },
        {
          text: "If any candidate withdraws for any reason, including death, all bets on the market will be valid and be settled as per the defined rules.",
        },
      ],
    },
  },
  {
    title: "Fancy Market Rules",
    content: {
      sections: [
        { text: "Even odd game betting rate rules." },
        {
          text: "1. Completed game is valid , in case due to rain over are reduced or match abandoned particular game will be deleted.",
        },
        {
          text: "2. All bets regarding to ODD/EVEN player/partnership are valid if one legal delivery is being played, else the bets will be deleted. Player odd/even all advance bets will be valid if one legal delivery is being played in match otherwise voided.",
        },
        {
          text: "3. If particular session result is valid then particular Odd/Even session is also valid for exp. 15 over session result settle then 15 over Odd/Even also settle if team all out 12.4",
        },
        { text: "4. In any circumstances management decision will be final." },
        { text: "" },
        { text: "Last Digit Lottery:-" },
        { text: "1. Lottery means Last Digit." },
        {
          text: "2. Completed Lottery Will be Settled, Incomplete Lottery Will be voided.",
        },
        {
          text: "3. Example :- We will Count Last Digit of particular Lottery Market, if in 6 over Market the Score is 42, so we will settle that particular market 2 Number.",
        },
        {
          text: "4. In case of Rain or If Over Gets Reduced then this Market will get Voided.",
        },
        {
          text: "5. If Particular Session Result is vaild then Particular Lottery Market also is vaild",
        },
        { text: "" },
        { text: "Top batsman rules:-" },
        {
          text: "1. If any player does not come as per playing eleven then all bets will be get deleted for the particular player.",
        },
        {
          text: "2. two players done the same run in a single match (M Agarwal 30 runs and A Rayudu 30 runs, whole inning top batsmen score also 30 run) then both player settlement to be get done 50 percent (50% , 50%)rate on their original value which given by our exchange.",
        },
        {
          text: "3.Suppose we have opened value of M Agarwal 3.75 back and customer place bets on 10000 @ 3.75 rates and A Rayudu 3.0 back and customer place bets on 10000 @ 3.0 rates.",
        },
        { text: "3.Whole inning result announces 30 run by both player then" },
        {
          text: "Rule of top batsman:-if you bet on M Agarwal you will be get half amount of this rate (10000*3.75/2=18750 you will get)",
        },
        {
          text: "Rule of top batsman:-if you bet on A Rayudu you will be get half amount of this rate (10000*3.00/2=15000 you will get)",
        },
        { text: "Top batsman only 1st inning valid." },
        {
          text: "For one day 50 over and for t-20 match 20 over must be played for top batsmen otherwise all bets will be deleted.",
        },
        { text: "" },
        { text: "Man of the Match Rules" },
        {
          text: "1. All bets will be deleted in case the match is abandoned or over reduced.",
        },
        {
          text: "2. All bets will be deleted if the mentioned player is not included in playing 11.",
        },
        {
          text: "3. In case Man of the Match is shared between two players then Dead heat rule will be applicable, For example K Perera and T Iqbal shares the Man of the Match, then the settlement will be done 50% of the rates accordingly.",
        },
        { text: "4. Rules similar to our Top Batsman rules." },
        { text: "" },
        { text: "Maximum Sixes by Team" },
        {
          text: "1. All bets will be deleted if match abandoned or over reduced",
        },
        {
          text: "2. All bets will be deleted if both the teams hits same number of sixes.",
        },
        { text: "3. Super over will not be considered." },
        { text: "" },
        { text: "Maximum 6 or 10 over runs" },
        {
          text: "1. All bets will be deleted if match abandoned or over reduced.",
        },
        {
          text: "2. All the bets will be deleted if both the teams score is same (Runs scored in 6 or 10 overs)",
        },
        { text: "3. 6 overs for T20 and 10 overs for ODI" },
        { text: "4. Both the innings are valid." },
        {
          text: "5. This fancy will be valid for 1st 6 overs of both innings for T20 and 1st 10 overs of both innings for ODI",
        },
        { text: "" },
        { text: "Batsman Match" },
        {
          text: "Batsman Match:- Bets for Favourite batsman from the two batsman matched.",
        },
        {
          text: "All bets will be deleted if any one of the mentioned player is not included in playing 11.",
        },
        {
          text: "All bets will be deleted unless one ball being played by both the mentioned players.",
        },
        {
          text: "All bets will be deleted if over reduced or Match abandoned.",
        },
        {
          text: "All bets will be deleted if both the player scored same run. For example H Amla and J Bairstow are the batsman matched, H Amla and J Bairstow both scored 38 runs then all bets will be deleted.",
        },
        { text: "Both innings will be valid" },
        { text: "" },
        { text: "Opening Pair" },
        {
          text: "1. Bets for Favourite opening pair from the two mentioned opening pair.",
        },
        {
          text: "2. Runs made by both the opening player will be added. For example:- J Roy scored 20 runs and J Bairstow scored 30 runs result will be 50 runs.",
        },
        {
          text: "3. Highest run made by the pair will be declared as winner. For example: Opening pair ENG total is 70 runs and Opening pair SA is 90 runs, then SA 90 runs will be declared as winner.",
        },
        { text: "Both innings will be valid" },
        { text: "" },
        { text: "Our exchange Special" },
        {
          text: "All bets will be deleted if the mentioned player is not included in playing 11.",
        },
        {
          text: "All bets will be deleted if match abandoned or over reduced.",
        },
        { text: "Both innings will be valid" },
        { text: "" },
        { text: "Direction of First Boundary" },
        {
          text: "All bets will be deleted if the mentioned batsman is not included in playing 11.",
        },
        {
          text: "All bets will be deleted if match abandoned or over reduced.",
        },
        {
          text: "The boundary hit through off side of the stump will be considered as off side four.",
        },
        {
          text: "The boundary hit through leg side of the stump will be considered as leg side four.",
        },
        {
          text: "Boundaries through extras (byes,leg byes,wide,overthrow) will not be considered as valid.",
        },
        { text: "Only 1st Inning will be considered" },
        { text: "" },
        { text: "Fifty & Century by Batsman" },
        {
          text: "All bets will be deleted if match abandoned or over reduced.",
        },
        {
          text: "All bets will be deleted if the mentioned batsman is not included in playing 11.",
        },
        {
          text: "All bets will be deleted unless the batsman faces one legal ball.",
        },
        { text: "Both Innings will be valid." },
        { text: "" },
        { text: "1st over Fancy" },
        { text: "Only 1st inning will be valid" },
        { text: "" },
        { text: "Odd Even Fancy" },
        {
          text: "Incompleted games will be deleted. Over reduced or abandoned all bets will be deleted.",
        },
        {
          text: "For example:-275 run SL bhav must be played 50 over if rain comes or any condition otherwise 275 run SL bets will be deleted.",
        },
        { text: "" },
        { text: "Next Man out" },
        {
          text: "Next man out fancy advance & in regular. Both inning will be valid. If any player does not come in opening then all bets will be deleted. If over reduced or abandoned then all bets will be deleted.",
        },
        { text: "" },
        { text: "Caught out" },
        {
          text: "Caught out fancy in advance & in regular. Both inning will be valid. If over reduced or match abandoned then all bets will be deleted.",
        },
        { text: "" },
        { text: "Wkt & All out Fancy" },
        {
          text: "5 wkt in 10 over & All out in 20 over fancy is valid for both inning. If match abandoned or over reduced all bets will be deleted.",
        },
        { text: "" },
        { text: "Test Match: Game Completed Fancy" },
        {
          text: "1. This is the fancy for match to be won/ completed in which day & session (Completed: Game has to be completed)",
        },
        {
          text: "2. If match drawn then all the sessions will be considered as lost.",
        },
        { text: "" },
        { text: "Meter Fancy" },
        {
          text: "In case match abandoned or over reduced mid point rule will be applicable",
        },
        {
          text: "For example: If Dhoni meter is 75 / 77 and the match abandoned or over reduced, then the result will be 76",
        },
        {
          text: "In case of single difference result will be given for the higher rate of the final rate (eg 53/54) and match gets abandoned then the result will be given as 54",
        },
        {
          text: "Midpoint rule is applicable for test match also. However for lambi meter/ inning meter 70 overs has to be played only then the same will be considered as valid",
        },
        { text: "" },
        { text: "Maximum Boundaries:-" },
        {
          text: "If the number of fours or sixes of both the team is equal, then all bets of the respective event will get voided",
        },
        { text: "" },
        { text: "Khado:- Test" },
        {
          text: "Minimum 70 over has to be played by the particular team only then the Khado of the team will be considered as valid, else the same will be voided",
        },
        { text: "" },
        { text: "Only Over Rule" },
        {
          text: "Only over session is not completed mid over so that Particular over session bets will be deleted.",
        },
        {
          text: "In case due to rain or match abandoned particular only session will be deleted.",
        },
        {
          text: "Ex :- 17.3 over team all out/run chase so only 18 over session bets will be deleted. in case 17.4 over team all out/run chase so only 18 over session bets will be valid.",
        },
        { text: "" },
        { text: "Penalty Runs Rule" },
        {
          text: "Penalty runs will be counted in all fancy. (This rule applicable from 20th March 2024)",
        },
        { text: "" },
        { text: "Total Match Fancy" },
        {
          text: "Total Match Six Hitters :- Number of players who hit six in a match. For Example :- 1st inning 5 players come for Batting and hit a six by 3 batsman & same as a 2nd inning 6 players come to bat and hit a six by 2 batsman. Result is 3 + 2 = 5",
        },
        {
          text: "Total Match Four Hitters :- Number of players who hit four in match. For example:- 1st inning 6 players come for batting and hit a four by 4 batsman & same as a 2nd inning 5 players come for batting and hit a four by 3 batsmen. Result is 4 + 3 = 7",
        },
        {
          text: "Total Match Wicket Takers :- Number of bowlers who take a wkt in match. For example :- 1st inning 5 bowlers come to bowling and wkt taker 3 bowlers & same as a 2nd inning 4 bowlers come to bowling and wkt taker 2 bowlers. Result is 3 + 2 = 5",
        },
        { text: "" },
        {
          text: "100 balls Event: The events for 1 to 100 balls will be considered valid only if the number of balls mentioned has been played completely. However if the balls got reduced before the particular event then the same will be voided, if the team batting first get all out prior to 100 balls the balance balls will be counted from second innings. For example if team batting first gets all out in 81 balls balance 19 balls will be counted from second innings and that 19 balls all events are counted. This same is valid for 1st Innings only.",
        },
        { text: "" },
        {
          text: "1. All fancy bets will be validated when match has been tied.",
        },
        {
          text: "2. All advance fancy will be suspended before toss or weather condition. All advance fancy will be voided if over reduced before match start.",
        },
        {
          text: "3. In case technical error or any circumstances any fancy is suspended and does not resume result will be given all previous bets will be valid (based on haar/jeet).",
        },
        {
          text: "4. If any case wrong rate has been given in fancy that particular bets will be cancelled.",
        },
        {
          text: "5. In any circumstances management decision will be final related to all exchange items. Our scorecard will be considered as valid if there is any mismatch in online portal",
        },
        {
          text: "6. In case customer make bets in wrong fancy we are not liable to delete, no changes will be made and bets will be consider as confirm bet.",
        },
        {
          text: "7. Due to any technical error market is open and result has came all bets after result will be deleted.",
        },
        { text: "8. Manual bets are not accepted in our exchange" },
        { text: "9.Our exchange will provide 5 second delay in our tv." },
        {
          text: "10. Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at same time (Punching) and others. Note : only winning bets will be voided.",
        },
        {
          text: "11. Company reserves the right to void any bets (only winning bets) of any event at any point of the match if the company believes there is any cheating/wrong doing in that particular event by the players (either batsman/bowler)",
        },
        {
          text: "12. Once our exchange give username and password it is your responsibility to change a password.",
        },
        {
          text: "14. Warning:- live scores and other data on this site is sourced from third party feeds and may be subject to time delays and/or be inaccurate. If you rely on this data to place bets, you do so at your own risk. Our exchange does not accept responsibility for loss suffered as a result of reliance on this data.",
        },
        {
          text: "15.Traders will be block the user ID if find any misinterpret activities, No queries accept regarding.",
        },
        {
          text: "16. In case, company will find Ground bets, Group betting, Punching bets, Multiple entries with same IP or any fraud or unusual activities are detected then Company will be void winning bets.",
        },
      ],
    },
  },

  {
    title: "Ashes Special",
    content: {
      sections: [
        {
          text: "Note: If Ashes fixture of 5 matches gets reduced for any reason, all special fancies will be voided (match abandoned due to rain/bad light will not be considered). Management decision will be final.",
        },
        { text: "" },
        {
          text: "1. Total 1st Over Runs of Ashes: Total of all five match 1st over runs will be counted. Only 1st innings valid. If Australia bats first, only Australia's 1st over is considered. If match abandoned, 3 runs average will be given.",
        },
        {
          text: "2. Total 1st 5 Over Runs of Ashes: Total of all five match 1st 5 overs will be counted. Only 1st innings valid. If Australia bats first, only Australia's 1st 5 overs considered. Abandoned match average: 17 runs.",
        },
        {
          text: "3. Total 1st 10 Over Runs of Ashes: Total of all five match 1st 10 overs will be counted. Only 1st innings valid. If Australia bats first, only their 1st 10 overs considered. Abandoned match average: 35 runs.",
        },
        {
          text: "4. Highest Single Innings Score of Ashes: Maximum runs scored by any team in any single innings.",
        },
        {
          text: "5. Highest Total Runs of Ashes: Maximum runs scored in any single match of the series. All innings counted.",
        },
        {
          text: "6. High Partnership Runs of Ashes: Highest partnership runs in any innings.",
        },
        {
          text: "7. High Partnership Balls of Ashes: Highest partnership balls faced in any innings.",
        },
        {
          text: "8. Top Batsman Runs in an Inn of Ashes: Maximum runs scored by a batsman in a single innings.",
        },
        {
          text: "9. Highest Run Scorer Runs of Ashes: Maximum runs scored by any batsman in the full tournament.",
        },
        {
          text: "10. Highest Wicket Taker Wickets of Ashes: Maximum wickets taken by any bowler in the full tournament.",
        },
        {
          text: "11. Events valid only if 300 overs have been played or match has been won. Otherwise, average values apply.",
        },
        {
          text: "12. Total 4s of Ashes: Abandoned or drawn match below 300 overs → 115 fours average.",
        },
        {
          text: "13. Total Wkts of Ashes: Abandoned/draw below 300 overs → 34 wickets average.",
        },
        {
          text: "14. Total Wides of Ashes: Abandoned/draw below 300 overs → 9 wides average.",
        },
        {
          text: "15. Total Noballs of Ashes: Abandoned/draw below 300 overs → 14 no-balls average.",
        },
        {
          text: "16. Total Extras of Ashes: Abandoned/draw below 300 overs → 55 extras average.",
        },
        {
          text: "17. Total Caught Outs of Ashes: Abandoned/draw below 300 overs → 22 caught-outs average.",
        },
        {
          text: "18. Total Bowled of Ashes: Abandoned/draw below 300 overs → 6 bowled average.",
        },
        {
          text: "19. Total LBW of Ashes: Abandoned/draw below 300 overs → 4 LBW average.",
        },
        {
          text: "20. Total Runout of Ashes: Abandoned/draw below 300 overs → 1 runout average.",
        },
        {
          text: "21. Total 30s of Ashes: Abandoned/draw below 300 overs → 5 scores of 30 average.",
        },
        {
          text: "22. Total 50s of Ashes: Abandoned/draw below 300 overs → 5 fifties average.",
        },
        {
          text: "23. Total 100s of Ashes: Abandoned/draw below 300 overs → 2 centuries average. 100+ scores counted.",
        },
        { text: "24. Total 150s of Ashes: All 150+ scores counted." },
        {
          text: "25. Total Maidens of Ashes: Abandoned/draw below 300 overs → 55 maidens average.",
        },
        {
          text: "26. Total Duckouts of Ashes: Abandoned/draw below 300 overs → 4 ducks average.",
        },
        {
          text: "27. Total Single Digit Scorers of Ashes: Abandoned/draw below 300 overs → 12 single-digit scores average.",
        },
        {
          text: "28. Total Double Digit Scorers of Ashes: Abandoned/draw below 300 overs → 20 double-digit scores average.",
        },
        {
          text: "29. Total Wicketkeeper's Dismissal of Ashes: Abandoned/draw below 300 overs → 8 dismissals average.",
        },
        {
          text: "30. Total Players facing 50+ Balls of Ashes: Abandoned/draw below 300 overs → 13 players average.",
        },
        {
          text: "31. Total Four Hitters of Ashes: Abandoned/draw below 300 overs → 28 four-hitters average.",
        },
        {
          text: "32. Total Wicket Takers of Ashes: Abandoned/draw below 300 overs → 16 wicket-takers average.",
        },
        {
          text: "33. Total Bowlers Giving 100+ Runs of Ashes: Abandoned/draw below 300 overs → 2 bowlers average.",
        },
        {
          text: "34. Highest Match 1st Over: Max runs in match 1st over. Only 1st innings valid.",
        },
        {
          text: "35. Highest Match 1st 5 Overs: Max runs in first 5 overs. Only 1st innings valid.",
        },
        {
          text: "36. Highest Match 1st 10 Overs: Max runs in first 10 overs. Only 1st innings valid.",
        },
        {
          text: "37. Highest 4s in Individual Match: Most fours in any full test match.",
        },
        {
          text: "38. Highest Wides in Individual Match: Most wides in a full test match.",
        },
        {
          text: "39. Highest Noballs in Individual Match: Most no-balls in a full test match.",
        },
        {
          text: "40. Highest Extras in Individual Match: Most extras in a full test match.",
        },
        {
          text: "41. Highest Caught Outs in Individual Match: Most caught-outs in a full test match.",
        },
        {
          text: "42. Highest Bowled in Individual Match: Most bowled dismissals in a full test match.",
        },
        {
          text: "43. Highest LBW in Individual Match: Most LBW dismissals in a full test match.",
        },
        {
          text: "44. Highest Runout in Individual Match: Most runouts in a full test match.",
        },
        {
          text: "45. Highest 30s in Individual Match: Most scores of 30 in a full test match.",
        },
        {
          text: "46. Highest 50s in Individual Match: Most fifties in a full test match.",
        },
        {
          text: "47. Highest 100s in Individual Match: Most hundreds in a full test match.",
        },
        {
          text: "48. Highest Maidens in Individual Match: Most maiden overs in a full test match.",
        },
        {
          text: "49. Highest Duckouts in Individual Match: Most ducks in a full test match.",
        },
        {
          text: "50. Highest Single Digit Scorers: Most single-digit scorers in a full test match.",
        },
        {
          text: "51. Highest Double Digit Scorers: Most double-digit scorers in a full test match.",
        },
        {
          text: "52. Highest Wicketkeeper's Dismissal in a Match: Most keeper dismissals (caught + stumping).",
        },
        {
          text: "53. Highest Players facing 50+ Balls in Match: Most players facing 50+ balls.",
        },
        {
          text: "54. Highest Four Hitters in Individual Match: Most four-hitters in a full test match.",
        },
        {
          text: "55. Highest Wicket Takers in Individual Match: Most wicket-takers in a full test match.",
        },
        {
          text: "56. Highest Bowlers Giving 100+ Runs in Match: Most bowlers conceding 100+ runs.",
        },
        {
          text: "57. Highest Scoring Over Runs: Max runs in any single over of any match.",
        },
        {
          text: "58. Most Balls faced by a Batsman in an Innings: Most balls faced in any innings.",
        },
        {
          text: "59. Most 4s by a Batsman in Ashes: Most fours by any batsman in the tournament.",
        },
        {
          text: "60. Most 50s by a Batsman in Ashes: Most fifties by any batsman in the tournament.",
        },
        {
          text: "61. Most 4s by a Batsman in an Innings: Most fours in a single innings.",
        },
        {
          text: "62. Most Runs given by a Bowler in an Innings: Most runs conceded in any innings.",
        },
        {
          text: "63. Most Wickets Taken by a Bowler in an Innings: Most wickets taken in a single innings.",
        },
        {
          text: "64. Most Wickets Taken by a Bowler in a Match: Most wickets in a full match (both innings counted).",
        },
      ],
    },
  },
  {
    title: "Indian Premier League (IPL)",
    content: {
      sections: [
        {
          text: "If IPL fixture of 74 matches gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this)",
        },
        {
          text: "At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid",
        },
        { text: "Management decision will be final" },
        { text: "" },
        { text: "Highest innings run - Only First innings is valid" },
        { text: "Lowest innings run - Only First innings is valid" },
        { text: "Highest Partnership Runs in IPL: Both Innings are valid" },
        {
          text: "Highest Run Scorer : Total Runs Scored by An Individual Batsman in Full Tournament",
        },
        {
          text: "Highest Wicket Taker : Total Wickets Taken by a Bowler in Full Tournament",
        },
        {
          text: "How Many time 5 or More Wickets taken by Bowlers : Number of time 5 or More Wickets taken by Bowlers. In Case Same Bowler 2 time 5 or More Wickets taken means Result Counted as 2.",
        },
        {
          text: "Total 4's: Average 29 Fours will be given in case match abandoned or over reduced",
        },
        {
          text: "Total 6's: Average 16 Sixes will be given in case match abandoned or over reduced",
        },
        {
          text: "Total 30's: Average 2 Thirties will be given in case match abandoned or over reduced",
        },
        {
          text: "Total 50's: Average 2 Fifties will be given in case match abandoned or over reduced",
        },
        {
          text: "Total No balls:- Average 1 No ball will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Wickets - Average will 12 Wickets be given in case match abandoned or over reduced",
        },
        {
          text: "Total Wides - Average 11 Wides will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Extras - Average 18 Extras will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Caught outs: Average 9 Caught out will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Bowled:- Average 2 Bowled out will be given in case match abandoned or over reduced",
        },
        {
          text: "Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Duckouts in IPL : Average 1 Duckout will be given in case match abandoned or over reduced",
        },
        {
          text: "Total 50+ Partnerships - Average 2 Fifty plus Partnerships will be given in case match abandoned or over reduced. 50 and 50 Above Partnerships All Counted in this.",
        },
        {
          text: "Total Highest Scoring Over Runs in IPL: Total of Every Match Highest Scoring Over Runs. Average 20 Runs will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total Runs Scored in IPL : Total Runs Scored in Full Tournament. Average 350 Runs will be Counted in case match abandoned or over reduced. Both Innings Counted.",
        },
        {
          text: "Highest Match 1st Over Run of IPL :Only First Innings is Valid.",
        },
        {
          text: "Highest 1st 6 over run: Only First Innings is Valid. Will not consider if over reduce before completion 6 over.",
        },
        {
          text: "Highest 1st 10 over run : Only First Innings is Valid. Will not consider if over reduce before completion 10 over.",
        },
        {
          text: "Highest 4s,6s,30s,50s Single Digit Scorers, Double Digit Scorers,Wickets,Caught Outs,Bowled,Lbw, Runouts, Stumpings, Duckouts,Wides and Extras in individual match: All Both innings are Counted.",
        },
        { text: "Highest Scoring Over Runs in IPL: Both innings are valid" },
        { text: "" },
        {
          text: "Bowler Event :- 2 Over Wkts , Dotballs, Boundaries , Runs bets valid in 1st two overs (1st inning valid ) The mention bowler has to run (start Over) the defined number of overs , else the bets related to that particular event will get void For example if the mentioned bowler has bowled 3 overs , then 2 over of that particular bowler will be considered as valid and the 4 over will get void. If team get all out in the mentioned bowler running over then result considered as valid. For example mentioned bowler 1.4 over bowler & team all out in 19.4 then bowler 2nd over result is valid and 4th over fancy is voided or bowler bowled 3.3 over & team all out on 19.3 then both 2 & 4 over is valid.",
        },
        { text: "" },
        {
          text: "Most 6's by individual batsman of IPL : Maximum Number of Sixes Hit By A Batsman in full Tournament. Ex. Last Season (2021) KL Rahul Hit 30 Sixes in 13 Matches. So, 30 was the Result for last season.",
        },
        {
          text: "Most Balls Faced By a Batsman of IPL : Maximum balls Faced by an Individual Batsman in the Single Match.",
        },
        {
          text: "Most runs given by Bowler in an Inning of IPL : Maximum Runs conceded by a individual Bowler in an Innings.",
        },
        {
          text: "Most Wide, Noball,Extras,4s,6s,30s,50s,50+ Pships,Caught Outs,LBWs, Runouts and Duckouts in an Innings Of the Match : Considered For Any Innings.All Both Innings Considered as Valid",
        },
        {
          text: "In fastest fifty always the first 50 runs will be considered, for example of R Sharma scores 1st fifty in 17 balls and scores 100 in next 14 balls, fastest 50 will be given based on the balls for the 1st fifty runs",
        },
        { text: "Super over will not be included" },
      ],
    },
  },
  {
    title: "The Hundred League",
    content: {
      sections: [
        {
          text: "If The Hundred fixture gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this)",
        },
        {
          text: "At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid",
        },
        { text: "Management decision will be final" },
        { text: "" },
        { text: "Highest innings run - Only First innings is valid" },
        { text: "Lowest innings run - Only First innings is valid" },
        { text: "Highest Partnership Runs: Both Innings are valid" },
        {
          text: "Highest Run Scorer : Total Runs Scored by An Individual Batsman in Full Tournament",
        },
        {
          text: "Highest Wicket Taker : Total Wickets Taken by a Bowler in Full Tournament",
        },
        {
          text: "Total 4's: Average 25 Fours will be given in case match abandoned or over reduced",
        },
        {
          text: "Total 6's: Average 8 Sixes will be given in case match abandoned or over reduced",
        },
        {
          text: "Total 30's: Average 2 Thirties will be given in case match abandoned or over reduced",
        },
        {
          text: "Total 50's: Average 1 Fifties will be given in case match abandoned or over reduced",
        },
        {
          text: "Total 100's: Average 0 Centuries will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Wickets - Average 15 Wickets will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Wides - Average 5 Wides will be given in case match abandoned or over reduced",
        },
        {
          text: "Total No balls:- Average 1 No ball will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Extras - Average 10 Extras will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Caught outs: Average 10 Caught out will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Bowled:- Average 2 Bowled out will be given in case match abandoned or over reduced",
        },
        {
          text: "Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced",
        },
        {
          text: "Total Duckouts : Average 2 Duckouts will be given in case match abandoned or over reduced",
        },
        {
          text: "Highest Match 1st 5 overs run (Powerplay): Only First Innings is Valid. Will not consider if over reduce before completion 5 overs.",
        },
        {
          text: "Highest 4s,6s,30s,50s,Wickets in individual match: All Both innings are Counted.",
        },
        { text: "Highest Scoring Over Runs: Both innings are valid" },
        {
          text: "Most runs given by Bowler in an Inning : Maximum Runs conceded by a individual Bowler in an Innings.",
        },
        {
          text: "Most wickets by Bowler in an inning : Maximum Wickets taken by a individual Bowler in an Innings",
        },
        { text: "Super over will not be included" },
      ],
    },
  },
  {
    title: "Women Premier League (WPL)",
    content: {
      sections: [
        {
          text: "If WPL fixture of 22 matches gets reduced due to any reason, then all the special fancies will be voided. Match abandoned due to rain or bad light will not be considered in this.",
        },
        {
          text: "At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid. Similarly, if the tournament gets canceled due to any reason, the previously given result will be considered valid.",
        },
        { text: "Management decision will be final." },
        { text: "" },
        { text: "Highest innings run: Only first innings is valid." },
        { text: "Lowest innings run: Only first innings is valid." },
        {
          text: "Highest total runs of WPL: Maximum runs scored by two teams in a single match.",
        },
        { text: "Highest partnership runs in WPL: Both innings are valid." },
        { text: "Highest partnership balls in WPL: Both innings are valid." },
        {
          text: "In fastest fifty, always the first 50 runs will be considered. For example, if a batsman scores first 50 in 17 balls and next 50 in 14 balls, fastest 50 will be calculated based on balls taken for the first 50 runs.",
        },
        {
          text: "Highest run scorer runs: Total runs scored by an individual batsman in the full tournament (Orange Cap).",
        },
        {
          text: "Highest wicket taker wickets: Total wickets taken by a bowler in the full tournament (Purple Cap).",
        },
        {
          text: "Total match 1st over runs: Average 6 runs will be given in case match abandoned or over reduced. First innings only considered.",
        },
        {
          text: "Total fours: Average 34 fours will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total wickets: Average 12 wickets will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total wides: Average 8 wides will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total extras: Average 14 extras will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total caught outs: Average 8 caught outs will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total bowled outs: Average 2 bowled outs will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total LBW: Average 1 LBW will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total run outs: Average 1 run out will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total 30s: Average 2 thirties will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total 50s: Average 1 fifty will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total duck outs: Average 1 duck out will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total single digit scorers: Average 6 single digit scorers will be given in case match abandoned or over reduced. Duck outs not considered. Not out or injured batsman facing one legal delivery and scoring 0 will be considered single digit.",
        },
        {
          text: "Total double digit scorers: Average 8 double digit scorers will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total four hitters in WPL: Average 10 four hitters will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total six hitters in WPL: Average 4 six hitters will be given in case match abandoned or over reduced.",
        },
        {
          text: "Total wicket takers in WPL: Average 7 wicket takers will be given in case match abandoned or over reduced.",
        },
        { text: "Highest 1st over runs: First innings only valid." },
        {
          text: "Highest 1st six over runs: First innings only valid. Will not be considered if overs are reduced before completion of 6 overs.",
        },
        {
          text: "Highest fours, wickets, wides and extras in individual match: Both innings are counted.",
        },
        {
          text: "Highest scoring over runs: Maximum runs scored in any single over in the full tournament.",
        },
        {
          text: "Most balls faced by a batsman: Maximum balls faced by an individual batsman in a single match.",
        },
        {
          text: "Most fours hit by a batsman in WPL innings: Maximum fours hit by an individual batsman in any single innings.",
        },
        {
          text: "Most dot balls by a bowler in WPL innings: Maximum dot balls by a single bowler in his 4 overs.",
        },
        {
          text: "Most runs conceded by a bowler in an innings: Maximum runs conceded by an individual bowler in an innings.",
        },
        {
          text: "Most wickets by a bowler in an innings: Maximum wickets taken by an individual bowler in an innings.",
        },
        {
          text: "If a match starts as an over-reduced or 20 over game and later overs are reduced due to rain interruption, comparison events such as highest fours, sixes, boundaries, 30s, 50s, wickets, wides, extras, caught outs, bowled, LBW, run out, duck out, single digit scorers, double digit scorers and wicket keeper dismissals will be considered for result.",
        },
        {
          text: "Example: If a match starts as a 20 overs game and later reduces to 16 overs due to rain, and maximum sixes are achieved in that match, that value will be considered for result.",
        },
        { text: "Super over will not be included." },
      ],
    },
  },
  {
    title: "Kabaddi",
    content: {
      sections: [
        {
          text: "In any circumstances management decision will be final related to all Fancy of kabaddi of our exchange.",
        },
        { text: "All fancy bets will be validated when match has been tied." },
        {
          text: "Result of individual player of fancy will be validated only when player play that match.",
        },
        {
          text: "In any case wrong rate has been given in fancy that particular bets will be deleted.",
        },
        {
          text: "For Playoffs Final Result Of 40 Minutes Of Two Halves Will Be Valid In Our Exchange.",
        },
      ],
    },
  },
  {
    title: "Binary",
    content: {
      sections: [
        { text: "All session's bets will be confirmed at market rate only." },
        {
          text: "All session's settlement price means result can be checked from exchange's official sites.",
        },
        {
          text: "All session's result will be settlement price provided by exchange after market close.",
        },
        {
          text: "Every product has two types of prices: SPOT and FUTURE. We provide only near month's FUTURE price in Binary Session.",
        },
        { text: "" },
        {
          text: "Session timings: NFY, B-NFY, AXS, ICI, RIL, SBI, TT STL - Monday to Friday 10:00 a.m. to 2:30 p.m.",
        },
        {
          text: "GOLD, SILVER, CRUDE - Monday to Friday 11:30 a.m. to 10:30 p.m.",
        },
        {
          text: "CMX CRUDE, DOWJONES, NASDAQ, SNP - Monday to Friday 7:30 p.m. to 12:00 a.m.",
        },
        { text: "" },
        { text: "Same bets same time from multiple ID not allowed." },
        {
          text: "Operating and market making bets (cheating/line/chamka bets) are not allowed.",
        },
        {
          text: "If any wrong rate has been given in fancy, that particular bet will be canceled.",
        },
        {
          text: "Deleted bets will remove under 24hr and clients will be notified.",
        },
      ],
    },
  },
  {
    title: "Match",
    content: {
      sections: [
        {
          text: "Company reserves the right to suspend/void any ID/bets if the same is found to be illegitimate.",
        },
        {
          text: "Example: If we find VPN/robot-use/multiple entry from the same IP or multiple bets at the same time, only winning bets will be voided.",
        },
        {
          text: "Example: In case of lay-back betting on wrong outcomes, the lower rate bets will be voided and higher rate bets will be considered valid.",
        },
        { text: "" },
        {
          text: "Tennis match odds: If 1st set has not been completed due to retirement or disqualification, all bets for that individual match will be void.",
        },
        {
          text: "Football match odds: All bets apply to full regular time including stoppage time. Extra time and penalty shootout are not included.",
        },
      ],
    },
  },
  {
    title: "Khado",
    content: {
      sections: [
        { text: "Only First inning valid for T20 and one day matches." },
        {
          text: "Same will be work like Lambi. If match abandoned or over reduced, all bets will be deleted.",
        },
        { text: "You can choose your own value in this event." },
      ],
    },
  },

  {
    title: "Virtual Tennis",
    content: {
      sections: [
        {
          text: "If streaming stops or some technical issue occurs, the match will be abandoned.",
        },
        {
          text: "If there is any technical interference in the match then also the match will be abandoned.",
        },
        {
          text: "There will be 3 sets in the match. There are 3 games in 1 set.",
        },
        {
          text: "In the match, within any set, there are 3-3 games between the two players (level game) till a tie break of 5 points is played, according to which the one who gets 2 points more than the difference of points will win the set.",
        },
      ],
    },
  },
  {
    title: "Genie Combo Special",
    content: {
      sections: [
        { text: "What is Genie Bet?" },
        {
          text: "Mumbai Indians will win + Quinton De Kock will score 20+ runs + Total Match Runs 385+ = 41.00 Combined Rate.",
        },
        { text: "" },
        {
          text: "1. If a ball is not bowled during a match, then all bets will be void.",
        },
        {
          text: "2. In the event of a match being decided by a bowl-off or toss of the coin, all bets will be void.",
        },
        {
          text: "3. If a player included in any selection in the bet is not named in the official starting XI then the whole bet will be made void, regardless of the rest of the selections within the bet. If the player takes to the pitch, then all player related bets will be settled accordingly as win/loss. 'Player A to get 1+ Six' would be a losing selection if he participates in fielding but does not bat. 'Player B to get 1+ Wicket' would be a losing selection if he takes any part in the match regardless of whether he bowls. This ruling refers to any player related markets.",
        },
        {
          text: "4. In the case of official substitutes/impact players etc, bets containing players that are official substitutes and not in the official starting XI's will be void.",
        },
        {
          text: "5. Any void selection within your bet, will deem the entire bet void.",
        },
        {
          text: "6. In the event of a batsman retiring for any reason, all relevant batting markets for this batsman will be settled on the runs at the time of their retirement.",
        },
        {
          text: "7. Penalty runs will not be included in any settlement totals.",
        },
        {
          text: "8. In case of rain or If over gets reduced then then all bets will be void.",
        },
      ],
    },
  },
];

const RulesModal = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = () => {
    setExpanded(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: "#081b2f",

          // Desktop: centered modal
          borderRadius: "12px",
          maxHeight: "90vh",
          // Mobile: full screen bottom sheet
          "@media (max-width: 600px)": {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            maxHeight: "90vh",
            borderRadius: "16px 16px 0 0",
          },
        },
      }}
      sx={{
        "@media (max-width: 600px)": {
          alignItems: "flex-end",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: `1px solid rgba(4,160,226,0.4)`,
          background: "#071123",
        }}
      >
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ReceiptLongOutlinedIcon sx={{ fontSize: "13px", color: "#000" }} />
        </Box>
        <Typography
          sx={{
            color: "#fff",
            fontSize: 13,
            fontWeight: 900,
            flex: 1,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Rules and Regulations
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          sx={{
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ p: "12px", overflowY: "auto", background: "#081b2f" }}
      >
        {/* All rules as expandable accordions */}
        <Box
          sx={{
            "& .MuiPaper-root": { backgroundImage: "none" },
            "& .MuiAccordion-root": {
              background: "transparent",
              boxShadow: "none",
              marginBottom: "6px !important",
              "&::before": { display: "none" },
            },
            "& .MuiAccordionSummary-root": {
              flexDirection: "row-reverse",
              gap: "10px",
              minHeight: "46px !important",
              padding: "0 12px",
              background: "#152b42",
              borderRadius: "20px !important",
              "&.Mui-expanded": {
                borderRadius: "20px !important",
              },
            },
            "& .MuiAccordionSummary-content": { margin: "0 !important" },
            "& .MuiAccordionDetails-root": {
              border: "none",
              display: "flex",
              flexDirection: "column",
              padding: "0 12px",
              background: "transparent",
              marginTop: "4px",
            },
          }}
        >
          {rules.map((rule, index) => (
            <Accordion
              key={index}
              disableGutters
              expanded={expanded === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: CYAN,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ExpandMoreIcon sx={{ fontSize: 18, color: "#002b36" }} />
                  </Box>
                }
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "'Lato', sans-serif",
                    ml: 0.5,
                  }}
                >
                  {rule.title}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                {rule.content.sections.map((section, idx) => (
                  <React.Fragment key={idx}>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: "'Lato', sans-serif",
                        fontStyle: section.italic ? "italic" : "normal",
                        lineHeight: 1.5,
                        py: "10px",
                        display: "block",
                      }}
                    >
                      {section.text}
                    </Typography>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.18)" }} />
                  </React.Fragment>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Footer note */}
        <Box
          sx={{
            mt: 2,
            pt: 1.5,
            textAlign: "center",
            borderTop: `1px solid rgba(4,160,226,0.3)`,
          }}
        >
          <Typography
            sx={{
              color: TEAL_LIGHT,
              fontSize: 11,
              opacity: 0.8,
              fontFamily: "Lato",
            }}
          >
            ⚡ All game rules are subject to terms & conditions ⚡
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RulesModal;
