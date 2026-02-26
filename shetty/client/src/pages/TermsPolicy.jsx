import React from "react";
import { FiFileText } from "react-icons/fi";

const PAGE_BG = "#071123";
const TEAL = "#008c95";
const TEAL_LIGHT = "#04a0e2";
const NOTE_WARNING = "#e07c3c";

function TermsPolicy() {
  return (
    <>
      <div className="terms-policy-inner">
        {/* Header: icon + TERM & POLICY */}
        <div className="terms-policy-header">
          <div className="terms-policy-header-icon">
            <FiFileText className="terms-policy-icon-svg" />
          </div>
          <div className="terms-policy-title">TERM & POLICY</div>
        </div>

        {/* NOTE section - teal background, NOTE: white, list items orange */}
        <section className="terms-policy-note">
          <p className="terms-policy-note-heading">NOTE:</p>
          <ol className="terms-policy-note-list">
            <li>
              1.Players using VPN and login from different IP frequently may
              result to void bets.
            </li>
            <li>
              2.And on the basis of different IP from multiple city we can
              suspend the account and void bets.
            </li>
          </ol>
        </section>

        {/* Section 1. INTRODUCTION */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">1. INTRODUCTION</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            The following terms and conditions apply to your use of this website
            (the "website") and its related or connected services (collectively,
            the "service"). You should carefully review these terms as they
            contain important information concerning your rights and obligations
            relating to your use of the website, whether as a guest or
            registered user with an account (an "account"). By accessing this
            website and using the service you agree to be bound by these terms
            together with any amendments which may be published from time to
            time by us. If you do not accept these terms, you must not access
            this website or use any part of it.
          </p>
        </section>

        {/* Section 2. GENERAL TERMS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">2. GENERAL TERMS</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            We reserve the right to revise and amend these terms of service at
            any time. You should visit this page periodically to review the
            terms and conditions. Any such changes will be binding and effective
            immediately upon publication on this website, unless you object to
            any such changes, in which case you must stop using our services.
            Your continued use of our website following such publication will
            indicate your agreement to be bound by the terms as amended. Any
            bets not settled prior to such changes taking effect will be subject
            to the pre-existing terms.
          </p>
        </section>

        {/* Section 3. YOUR OBLIGATIONS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">3. YOUR OBLIGATIONS.</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            You Acknowledge That At All Times When Accessing The Website And
            Using The Service:
          </p>
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              You must be 18 years or older, or at least the legal age of
              majority in the jurisdiction where you live, to participate in any
              of our games. We reserve the right to ask for proof of age
              documents at any time.
            </li>
            <li>
              You Are Of Legal Capacity And Can Enter Into A Binding Legal
              Agreement With Us. You Must Not Access The Website Or Utilize The
              Service If You Are Not Of Legal Capacity.
            </li>
            <li>
              You Are A Resident In A Jurisdiction That Allows Gambling. You Are
              Not A Resident Of Any Country In Which Access To Online Gambling
              To Its Residents Or To Any Person Within Such Country Is
              Prohibited. It Is Your Sole Responsibility To Ensure That Your Use
              Of The Service Is Legal.
            </li>
            <li>
              You May Not Use A VPN, Proxy Or Similar Services Or Devices That
              Mask Or Manipulate The Identification Of Your Real Location.
            </li>
            <li>You Are The Authorized User Of The Payment Method You Use.</li>
            <li>
              You Must Make All Payments To Us In Good Faith And Not Attempt To
              Reverse A Payment Made Or Take Any Action Which Will Cause Such
              Payment To Be Reversed By A Third Party.
            </li>
            <li>
              When Placing Bets You May Lose Some Or All Of Your Money Deposited
              To The Service In Accordance With These Terms And You Will Be
              Fully Responsible For That Loss.
            </li>
            <li>
              When Placing Bets You Must Not Use Any Information Obtained In
              Breach Of Any Legislation In Force In The Country In Which You
              Were When The Bet Was Placed.
            </li>
            <li>
              You Are Not Acting On Behalf Of Another Party Or For Any
              Commercial Purposes, But Solely On Your Own Behalf As A Private
              Individual In A Personal Capacity.
            </li>
            <li>
              You Must Not Either Attempt To Manipulate Any Market Or Element
              Within The Service In Bad Faith Nor In A Manner That Adversely
              Affects The Integrity Of The Service Or Us.
            </li>
            <li>
              You Must Generally Act In Good Faith In Relation To Us Of The
              Service At All Times And For All Bets Made Using The Service.
            </li>
            <li>
              You, Or, If Applicable, Your Employees, Employers, Agents, Or
              Family Members, Are Not Registered As An Affiliate In Our
              Affiliate Program.
            </li>
          </ol>
        </section>

        {/* Section 4. RESTRICTED USE */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">4. RESTRICTED USE</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            4.1. You Must Not Use The Service:
          </p>
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              If You Are Under The Age Of 18 Years (Or Below The Age Of Majority
              As Stipulated In The Laws Of The Jurisdiction Applicable To You)
              or if you are not legally able to enter into a binding legal
              agreement with us or you acting as an agent for, or otherwise on
              behalf, of a person under 18 years (or below the age of majority
              as stipulated in the laws of the jurisdiction applicable to you);
            </li>
            <li>
              If You Reside In A Country In Which Access To Online Gambling To
              Its Residents Or To Any Person Within Such Country Is Prohibited.
            </li>
            <li>
              If You Are A Resident Of One Of The Following Countries, Or
              Accessing The Website From One Of The Following Countries: United
              States Of America And Its Territories, France And Its Territories,
              Netherlands And Its Territories And Countries That Form The
              Kingdom Of Netherlands, Including Bonaire, Sint Eustatius, Saba,
              Aruba, Curaçao And Sint Maarten, Australia And Its Territories,
              United Kingdom Of Great Britain And Northern Ireland, Spain,
              Cyprus.
            </li>
            <li>
              To Collect Nicknames, E-Mail Addresses And/Or Other Information Of
              Other Customers By Any Means (For Example, By Sending Spam, Other
              Types Of Unsolicited Emails Or The Unauthorised Framing Of, Or
              Linking To, The Service);
            </li>
            <li>
              To Disrupt Or Unduly Affect Or Influence The Activities Of Other
              Customers Or The Operation Of The Service Generally;
            </li>
            <li>
              To Promote Unsolicited Commercial Advertisements, Affiliate Links,
              And Other Forms Of Solicitation Which May Be Removed From The
              Service Without Notice;
            </li>
            <li>
              In Any Way Which, In Our Reasonable Opinion, Could Be Considered
              As An Attempt To: (I) Cheat The Service Or Another Customer Using
              The Service; Or (Ii) Collude With Any Other Customer Using The
              Service In Order To Obtain A Dishonest Advantage;
            </li>
            <li>
              To Scrape Our Odds Or Violate Any Of Our Intellectual Property
              Rights; Or
            </li>
            <li>For Any Unlawful Activity Whatsoever.</li>
          </ol>
          <p className="terms-policy-body" style={{ marginTop: "12px" }}>
            4.2. You Cannot Sell Or Transfer Your Account To Third Parties, Nor
            Can You Acquire A Player Account From A Third Party.
          </p>
          <p className="terms-policy-body">
            4.3. You May Not, In Any Manner, Transfer Funds Between Player
            Accounts.
          </p>
          <p className="terms-policy-body">
            4.4. We May Immediately Terminate Your Account Upon Written Notice
            To You If You Use The Service For Unauthorised Purposes. We May Also
            Take Legal Action Against You For Doing So In Certain Circumstances.
          </p>
          <p className="terms-policy-body">
            4.5. Employees Of Company, Its Licensees, Distributors, Wholesalers,
            Subsidiaries, Advertising, Promotional Or Other Agencies, Media
            Partners, Contractors, Retailers And Members Of The Immediate
            Families Of Each Are NOT Allowed To Use The Service For Real Money
            Without Prior Consent From The Company Director Or CEO. Should Such
            Activity Be Discovered, The Account(S) Will Be Immediately
            Terminated And All Bonuses/Winnings Will Be Forfeited.
          </p>
          <p className="terms-policy-body">
            4.6. Only One Bonus Is Allowed Per Customer, Family, Address, Shared
            Computer, Shared IP Address, Any Identical Account Details Including
            E-Mail Address, Bank Account Details, Credit Card Information And
            Payment System Account. Any Misuse Of This Bonus Offer Will Lead To
            An Account Being Closed.
          </p>
        </section>

        {/* Section 5. REGISTRATION */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">5. REGISTRATION</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            You Agree That At All Times When Using The Service:
          </p>
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              We Reserve The Right To Refuse To Accept A Registration
              Application From Any Applicant At Our Sole Discretion And Without
              Any Obligation To Communicate A Specific Reason.
            </li>
            <li>
              Before Using The Service, You Must Personally Complete The
              Registration Form And Read And Accept These Terms. In Order To
              Start Betting On The Service Or Withdraw Your Winnings, We May
              Require You To Become A Verified Customer Which Includes Passing
              Certain Checks. You May Be Required To Provide A Valid Proof Of
              Identification And Any Other Document As It May Be Deemed
              Necessary. This Includes But Is Not Limited To, A Picture ID (Copy
              Of Passport, Driver's Licence Or National ID Card) And A Recent
              Utility Bill Listing Your Name And Address As Proof Of Residence.
              We Reserve The Right To Suspend Wagering Or Restrict Account
              Options On Any Account Until The Required Information Is Received.
              This Procedure Is Done In Accordance With The Applicable Gaming
              Regulation And The Anti-Money Laundering Legal Requirements.
              Additionally, You Will Need To Fund Your Service Account Using The
              Payment Methods Set Out On The Payment Section Of Our Website.
            </li>
            <li>
              You Have To Provide Accurate Contact Information, Inclusive Of A
              Valid Email Address ("Registered Email Address"), And Update Such
              Information In The Future To Keep It Accurate. It Is Your
              Responsibility To Keep Your Contact Details Up To Date On Your
              Account. Failure To Do So May Result In You Failing To Receive
              Important Account Related Notifications And Information From Us,
              Including Changes We Make To These Terms. We Identify And
              Communicate With Our Customers Via Their Registered Email Address.
              It Is The Responsibility Of The Customer To Maintain An Active And
              Unique Email Account, To Provide Us With The Correct Email Address
              And To Advise Company Of Any Changes In Their Email Address. Each
              Customer Is Wholly Responsible For Maintaining The Security Of His
              Registered Email Address To Prevent The Use Of His Registered
              Email Address By Any Third Party. Company Shall Not Be Responsible
              For Any Damages Or Losses Deemed Or Alleged To Have Resulted From
              Communications Between Company And The Customer Using The
              Registered Email Address. Any Customer Not Having An Email Address
              Reachable By Company Will Have His Account Suspended Until Such An
              Address Is Provided To Us. We Will Immediately Suspend Your
              Account Upon Written Notice To You To This Effect If You
              Intentionally Provide False Or Inaccurate Personal Information. We
              May Also Take Legal Action Against You For Doing So In Certain
              Circumstances And/Or Contact The Relevant Authorities Who May Also
              Take Action Against You.
            </li>
            <li>
              You Are Only Allowed To Register One Account With The Service.
              Accounts Are Subject To Immediate Closure If It Is Found That You
              Have Multiple Accounts Registered With Us. This Includes The Use
              Of Representatives, Relatives, Associates, Affiliates, Related
              Parties, Connected Persons And/Or Third Parties Operating On Your
              Behalf.
            </li>
            <li>
              In Order To Ensure Your Financial Worthiness And To Confirm Your
              Identity, We May Ask You To Provide Us With Additional Personal
              Information, Such As Your Name And Surname, Or Use Any Third-Party
              Information Providers We Consider Necessary. Should Any Additional
              Personal Information Be Obtained Via Third-Party Sources, We Will
              Inform You About The Data Obtained.
            </li>
            <li>
              You Must Keep Your Password For The Service Confidential. Provided
              That The Account Information Requested Has Been Correctly
              Supplied, We Are Entitled To Assume That Bets, Deposits And
              Withdrawals Have Been Made By You. We Advise You To Change Your
              Password On A Regular Basis And Never Disclose It To Any Third
              Party. It Is Your Responsibility To Protect Your Password And Any
              Failure To Do So Shall Be At Your Sole Risk And Expense. You May
              Log Out Of The Service At The End Of Each Session. If You Believe
              Any Of Your Account Information Is Being Misused By A Third Party,
              Or Your Account Has Been Hacked Into, Or Your Password Has Been
              Discovered By A Third Party, You Must Notify Us Immediately. You
              Must Notify Us If Your Registered Email Address Has Been Hacked
              Into, We May, However, Require You To Provide Additional
              Information/ Documentation So That We Can Verify Your Identity. We
              Will Immediately Suspend Your Account Once We Are Aware Of Such An
              Incident. In The Meantime You Are Responsible For All Activity On
              Your Account Including Third Party Access, Regardless Of Whether
              Or Not Their Access Was Authorised By You.
            </li>
            <li>
              You Must Not At Any Time Transmit Any Content Or Other Information
              On The Service To Another Customer Or Any Other Party By Way Of A
              Screen Capture (Or Other Similar Method), Nor Display Any Such
              Information Or Content In A Frame Or In Any Other Manner That Is
              Different From How It Would Appear If Such Customer Or Third Party
              Had Typed The URL For The Service Into The Browser Line.
            </li>
            <li>
              When Registering, You Will Receive Possibility To Use All
              Currencies Available On The Website. Those Will Be The Currencies
              Of Your Deposits, Withdrawals And Bets Placed And Matched Into The
              Service As Set Out In These Terms. Some Payment Methods Do Not
              Process In All Currencies. In Such Cases A Processing Currency
              Will Be Displayed, Along With A Conversion Calculator Available On
              The Page.
            </li>
            <li>
              We Are Under No Obligation To Open An Account For You And Our
              Website Sign-Up Page Is Merely An Invitation To Treat. It Is
              Entirely Within Our Sole Discretion Whether Or Not To Proceed With
              The Opening Of An Account For You And, Should We Refuse To Open An
              Account For You, We Are Under No Obligation To Provide You With A
              Reason For The Refusal.
            </li>
            <li>
              Upon Receipt Of Your Application, We May Be In Touch To Request
              Further Information And/ Or Documentation From You In Order For Us
              To Comply With Our Regulatory And Legal Obligations.
            </li>
          </ol>
        </section>

        {/* Section 6. YOUR ACCOUNT */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">6. YOUR ACCOUNT</h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              Accounts Could Use Several Currencies, In This Case All Account
              Balances And Transactions Appear In The Currency Used For The
              Transaction.
            </li>
            <li>We Do Not Give Credit For The Use Of The Service.</li>
            <li>
              We May Close Or Suspend An Account If You Are Not Or We Reasonably
              Believe That You Are Not Complying With These Terms, Or To Ensure
              The Integrity Or Fairness Of The Service Or If We Have Other
              Reasonable Grounds To Do So. We May Not Always Be Able To Give You
              Prior Notice. If We Close Or Suspend Your Account Due To You Not
              Complying With These Terms, We May Cancel And/Or Void Any Of Your
              Bets And Withhold Any Money In Your Account (Including The
              Deposit).
            </li>
            <li>
              We Reserve The Right To Close Or Suspend Any Account Without Prior
              Notice And Return All Funds. Contractual Obligations Already
              Matured Will However Be Honoured.
            </li>
            <li>
              We Reserve The Right To Refuse, Restrict, Cancel Or Limit Any
              Wager At Any Time For Whatever Reason, Including Any Bet Perceived
              To Be Placed In A Fraudulent Manner In Order To Circumvent Our
              Betting Limits And/ Or Our System Regulations.
            </li>
            <li>
              If Any Amount Is Mistakenly Credited To Your Account It Remains
              Our Property And When We Become Aware Of Any Such Mistake, We
              Shall Notify You And The Amount Will Be Withdrawn From Your
              Account.
            </li>
            <li>
              If, For Any Reason, Your Account Goes Overdrawn, You Shall Be In
              Debt To Us For The Amount Overdrawn.
            </li>
            <li>
              You Must Inform Us As Soon As You Become Aware Of Any Errors With
              Respect To Your Account.
            </li>
            <li>
              Please Remember That Betting Is Purely For Entertainment And
              Pleasure And You Should Stop As Soon As It Stops Being Fun.
              Absolutely Do Not Bet Anything You Can't Afford To Lose. If You
              Feel That You May Have Lost Control Of Your Gambling, We Offer A
              Self-Exclusion Option. Just Send A Message To Our Customer Support
              Department Using Your Registered Email Address That You Wish To
              SELF-EXCLUDE And This Request Will Take Effect Within 24 Hours
              From The Moment Of Its Receipt. In This Case Your Account Will Be
              Disabled Until Your Further Notice, And You Won't Be Able To Login
              To It.
            </li>
            <li>
              You Cannot Transfer, Sell, Or Pledge Your Account To Another
              Person. This Prohibition Includes The Transfer Of Any Assets Of
              Value Of Any Kind, Including But Not Limited To Ownership Of
              Accounts, Winnings, Deposits, Bets, Rights And/Or Claims In
              Connection With These Assets, Legal, Commercial Or Otherwise. The
              Prohibition On Said Transfers Also Includes However Is Not Limited
              To The Encumbrance, Pledging, Assigning, Usufruct, Trading,
              Brokering, Hypothecation And/Or Gifting In Cooperation With A
              Fiduciary Or Any Other Third Party, Company, Natural Or Legal
              Individual, Foundation And/Or Association In Any Way Shape Or Form
            </li>
            <li>
              Should You Wish To Close Your Account With Us, Please Send An
              Email From Your Registered Email Address To Our Customer Support
              Department Via The Links On The Website.
            </li>
          </ol>
        </section>

        {/* Section 7. DEPOSIT OF FUNDS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">7. DEPOSIT OF FUNDS</h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              All Deposits Should Be Made From An Account Or Payment System Or
              Credit Card That Is Registered In Your Own Name, And Any Deposits
              Made In Any Other Currency Will Be Converted Using The Daily
              Exchange Rate Obtained From Oanda.Com, Or At Our Own Bank's Or Our
              Payment Processor's Prevailing Rate Of Exchange Following Which
              Your Account Will Be Deposited Accordingly. Note That Some Payment
              Systems May Apply Additional Currency Exchange Fees Which Will Be
              Deducted From The Sum Of Your Deposit.
            </li>
            <li>
              Fees And Charges May Apply To Customer Deposits And Withdrawals,
              Which Can Be Found On The Website. In Most Cases We Absorb
              Transaction Fees For Deposits To Your www.domain_name.com Account.
              You Are Responsible For Your Own Bank Charges That You May Incur
              Due To Depositing Funds With Us.
            </li>
            <li>
              Company Is Not A Financial Institution And Uses A Third Party
              Electronic Payment Processors To Process Credit And Debit Card
              Deposits; They Are Not Processed Directly By Us. If You Deposit
              Funds By Either A Credit Card Or A Debit Card, Your Account Will
              Only Be Credited If We Receive An Approval And Authorisation Code
              From The Payment Issuing Institution. If Your Card Issuer Gives No
              Such Authorisation, Your Account Will Not Be Credited With Those
              Funds.
            </li>
            <li>
              You Agree To Fully Pay Any And All Payments And Charges Due To Us
              Or To Payment Providers In Connection With Your Use Of The
              Service. You Further Agree Not To Make Any Charge-Backs Or
              Renounce Or Cancel Or Otherwise Reverse Any Of Your Deposits, And
              In Any Such Event You Will Refund And Compensate Us For Such
              Unpaid Deposits Including Any Expenses Incurred By Us In The
              Process Of Collecting Your Deposit, And You Agree That Any
              Winnings From Wagers Utilising Those Charged Back Funds Will Be
              Forfeited. You Acknowledge And Agree That Your Player Account Is
              Not A Bank Account And Is Therefore Not Guaranteed, Insured Or
              Otherwise Protected By Any Deposit Or Banking Insurance System Or
              By Any Other Similar Insurance System Of Any Other Jurisdiction,
              Including But Not Limited To Your Local Jurisdiction. Furthermore,
              The Player Account Does Not Bear Interest On Any Of The Funds Held
              In It.
            </li>
            <li>
              If You Decide To Accept Any Of Our Promotional Or Bonus Offer By
              Entering A Bonus Code During Deposit, You Agree To The Terms Of
              Bonuses And Terms Of Each Specific Bonus.
            </li>
            <li>
              Funds Originating From Criminal And/Or Illegal And/Or Unauthorized
              Activities Must Not Be Deposited With Us.
            </li>
            <li>
              If You Deposit Using Your Credit Card, It Is Recommended That You
              Retain A Copy Of Transaction Records And A Copy Of These Terms.
            </li>
            <li>
              Internet Gambling May Be Illegal In The Jurisdiction In Which You
              Are Located; If So, You Are Not Authorized To Use Your Payment
              Card To Deposit On This Site. It Is Your Responsibility To Know
              The Laws Concerning Online Gambling In Your Country Of Domicile.
            </li>
          </ol>
        </section>

        {/* Section 8. WITHDRAWAL OF FUNDS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">8. WITHDRAWAL OF FUNDS</h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              You May Withdraw Any Unutilized And Cleared Funds Held In Your
              Player Account By Submitting A Withdrawal Request In Accordance
              With Our Withdrawal Conditions. The Minimum Withdrawal Amount Per
              Transaction is INR 1000 (Or Equivalent In Other Currency) With The
              Exception Of An Account Closure In Which Case You May Withdraw The
              Full Balance.
            </li>
            <li>
              There Are No Withdrawal Commissions If You Roll Over (Wager) The
              Deposit At Least 1 Time. Otherwise We Are Entitled To Deduct A 10%
              Fee With Minimum Sum Of 400 INR (Or Equivalent In Your Account
              Currency) In Order To Combat Money Laundering.
            </li>
            <li>
              We Reserve The Right To Request Photo ID, Address Confirmation Or
              Perform Additional Verification Procedures (Request Your Selfie,
              Arrange A Verification Call Etc.) For The Purpose Of Identity
              Verification Prior To Granting Any Withdrawals From Your Account.
              We Also Reserve Our Rights To Perform Identity Verification At Any
              Time During The Lifetime Of Your Relationship With Us.
            </li>
            <li>
              All Withdrawals Must Be Made To The Original Debit, Credit Card,
              Bank Account, Method Of Payment Used To Make The Payment To Your
              Account. We May, And Always At Our Own Discretion, Allow You To
              Withdraw To A Payment Method From Which Your Original Deposit Did
              Not Originate. This Will Always Be Subject To Additional Security
              Checks.
            </li>
            <li>
              Should You Wish To Withdraw Funds But Your Account Is Either
              Inaccessible, Dormant, Locked Or Closed, Please Contact Our
              Customer Service Department.
            </li>
            <li>
              In Cases When Your Balance Is At Least 10 Times Larger Than The
              Total Sum Of Your Deposits, You Will Be Limited To INR 500,000 (Or
              Currency Equivalent) For Withdrawal Per Month. In Other Cases The
              Maximum Withdrawal Amount Per Month Is INR 10,00,000.
            </li>
            <li>
              Please Note That We Cannot Guarantee Successful Processing Of
              Withdrawals Or Refunds In The Event If You Breach The Restricted
              Use Policy Stated In Clauses 3.3 And 4.
            </li>
          </ol>
        </section>

        {/* Section 9. PAYMENT TRANSACTIONS AND PROCESSORS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            9. PAYMENT TRANSACTIONS AND PROCESSORS
          </h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              You Are Fully Responsible For Paying All Monies Owed To Us. You
              Must Make All Payments To Us In Good Faith And Not Attempt To
              Reverse A Payment Made Or Take Any Action Which Will Cause Such
              Payment To Be Reversed By A Third Party In Order To Avoid A
              Liability Legitimately Incurred. You Will Reimburse Us For Any
              Charge-Backs, Denial Or Reversal Of Payment You Make And Any Loss
              Suffered By Us As A Consequence Thereof. We Reserve The Right To
              Also Impose An Administration Fee Of INR 5000, Or Currency
              Equivalent Per Charge-Back, Denial Or Reversal Of Payment You
              Make.
            </li>
            <li>
              We Reserve The Right To Use Third Party Electronic Payment
              Processors And Or Merchant Banks To Process Payments Made By You
              And You Agree To Be Bound By Their Terms And Conditions Providing
              They Are Made Aware To You And Those Terms Do Not Conflict With
              These Terms.
            </li>
            <li>
              All Transactions Made On Our Site Might Be Checked To Prevent
              Money Laundering Or Terrorism Financing Activity. Suspicious
              Transactions Will Be Reported To The Relevant Authority.
            </li>
          </ol>
        </section>

        {/* Section 10. ERRORS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">10. ERRORS</h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              In The Event Of An Error Or Malfunction Of Our System Or
              Processes, All Bets Are Rendered Void. You Are Under An Obligation
              To Inform Us Immediately As Soon As You Become Aware Of Any Error
              With The Service. In The Event Of Communication Or System Errors
              Or Bugs Or Viruses Occurring In Connection With The Service And/Or
              Payments Made To You As A Result Of A Defect Or Error In The
              Service, We Will Not Be Liable To You Or To Any Third Party For
              Any Direct Or Indirect Costs, Expenses, Losses Or Claims Arising
              Or Resulting From Such Errors, And We Reserve The Right To Void
              All Games/Bets In Question And Take Any Other Action To Correct
              Such Errors.
            </li>
            <li>
              We Make Every Effort To Ensure That We Do Not Make Errors In
              Posting Bookmaker Lines. However, If As A Result Of Human Error Or
              System Problems A Bet Is Accepted At An Odd That Is: Materially
              Different From Those Available In The General Market At The Time
              The Bet Was Made; Or Clearly Incorrect Given The Chance Of The
              Event Occurring At The Time The Bet Was Made Then We Reserve The
              Right To Cancel Or Void That Wager, Or To Cancel Or Void A Wager
              Made After An Event Has Started.
            </li>
            <li>
              We Have The Right To Recover From You Any Amount Overpaid And To
              Adjust Your Account To Rectify Any Mistake. An Example Of Such A
              Mistake Might Be Where A Price Is Incorrect Or Where We Enter A
              Result Of An Event Incorrectly. If There Are Insufficient Funds In
              Your Account, We May Demand That You Pay Us The Relevant
              Outstanding Amount Relating To Any Erroneous Bets Or Wagers.
              Accordingly, We Reserve The Right To Cancel, Reduce Or Delete Any
              Pending Plays, Whether Placed With Funds Resulting From The Error
              Or Not.
            </li>
          </ol>
        </section>

        {/* Section 11. RULES OF PLAY, REFUNDS AND CANCELLATIONS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            11. RULES OF PLAY, REFUNDS AND CANCELLATIONS
          </h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              The Winner Of An Event Will Be Determined On The Date Of The
              Event's Settlement, And We Will Not Recognize Protested Or
              Overturned Decisions For Wagering Purposes.
            </li>
            <li>
              All Results Posted Shall Be Final After 72 Hours And No Queries
              Will Be Entertained After That Period Of Time. Within 72 Hours
              After Results Are Posted, We Will Only Reset/Correct The Results
              Due To Human Error, System Error Or Mistakes Made By The Referring
              Results Source.
            </li>
            <li>
              If A Match Result Is Overturned For Any Reason By The Governing
              Body Of The Match Within The Payout Period Then All Money Will Be
              Refunded.
            </li>
            <li>
              If A Draw Occurs In A Game Where A Draw Option Is Offered All
              Stakes On A Team Win Or Lose Will Be Lost. If A Draw Option Is Not
              Offered Then Everyone Receives A Refund In The Outcome Of A Draw
              On The Match. And If A Draw Option Has Not Been Made Available,
              Then Extra Time Will Count, If Played.
            </li>
            <li>
              If A Result Cannot Be Validated By Us, For Instance If The Feed
              Broadcasting The Event Is Interrupted (And Cannot Be Verified By
              Another Source) Then At Our Election, The Wagers On That Event
              Will Be Deemed Invalid And Wagers Refunded.
            </li>
            <li>
              Minimum And Maximum Wager Amounts On All Events Will Be Determined
              By Us And Are Subject To Change Without Prior Written Notice. We
              Also Reserve The Right To Adjust Limits On Individual Accounts As
              Well.
            </li>
            <li>
              Customers Are Solely Responsible For Their Own Account
              Transactions. Once A Transaction Is Complete, It Cannot Be
              Changed. We Do Not Take Responsibility For Missing Or Duplicate
              Wagers Made By The Customer And Will Not Entertain Discrepancy
              Requests Because A Play Is Missing Or Duplicated. Customers May
              Review Their Transactions In The My Account Section Of The Site
              After Each Session To Ensure All Requested Wagers Were Accepted.
            </li>
            <li>
              A Matchup Will Have Action As Long As The Two Teams Are Correct,
              And Regardless Of The League Header In Which It Is Placed On Our
              Website.
            </li>
            <li>
              The Start Dates And Times Displayed On The Website For ESport
              Matches Are An Indication Only And Are Not Guaranteed To Be
              Correct. If A Match Is Suspended Or Postponed, And Not Resumed
              Within 72 Hours From The Actual Scheduled Start Time, The Match
              Will Have No Action And Wagers Will Be Refunded. The Exception
              Being Any Wager On Whether A Team/Player Advances In A Tournament,
              Or Wins The Tournament, Will Have Action Regardless Of A Suspended
              Or Postponed Match.
            </li>
            <li>
              If An Event Is Posted By Us With An Incorrect Date, All Wagers
              Have Action Based On The Date Announced By The Governing Body.
            </li>
            <li>
              If A Team Is Using Stand-Ins, The Result Is Still Valid As It Was
              The Team's Choice To Use The Stand-Ins.
            </li>
            <li>
              Company Reserves The Right To Remove Events, Markets And Any Other
              Products From The Website.
            </li>
            <li>
              In-Depth Explanation Of Our Sports Betting Rules Is On The
              Separate Page: SPORTS BETTING RULES
            </li>
          </ol>
        </section>

        {/* Section 12. COMMUNICATIONS AND NOTICES */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            12. COMMUNICATIONS AND NOTICES
          </h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              All Communications And Notices To Be Given Under These Terms By
              You To Us Shall Be Sent Using A Customer Support Form On The
              Website.
            </li>
            <li>
              All Communications And Notices To Be Given Under These Terms By Us
              To You Shall, Unless Otherwise Specified In These Terms, Be Either
              Posted On The Website And/Or Sent To The Registered Email Address
              We Hold On Our System For The Relevant Customer. The Method Of
              Such Communication Shall Be In Our Sole And Exclusive Discretion.
            </li>
            <li>
              All Communications And Notices To Be Given Under These Terms By
              Either You Or Us Shall Be In Writing In The English Language And
              Must Be Given To And From The Registered Email Address In Your
              Account.
            </li>
            <li>
              From Time To Time, We May Contact You By Email For The Purpose Of
              Offering You Information About Betting, Unique Promotional
              Offerings, And Other Information From www.domain_name.com Website.
              You Agree To Receive Such Emails When You Agree To These Terms
              When Registering At The Website. You Can Choose To Opt Out Of
              Receiving Such Promotional Offerings From Us At Any Time By
              Submitting A Request To The Customer Support.
            </li>
          </ol>
        </section>

        {/* Section 13. MATTERS BEYOND OUR CONTROL */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            13. MATTERS BEYOND OUR CONTROL
          </h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            We Cannot Be Held Liable For Any Failure Or Delay In Providing The
            Service Due To An Event Of Force Majeure Which Could Reasonably Be
            Considered To Be Outside Our Control Despite Our Execution Of
            Reasonable Preventative Measures Such As: An Act Of God; Trade Or
            Labour Dispute; Power Cut; Act, Failure Or Omission Of Any
            Government Or Authority; Obstruction Or Failure Of Telecommunication
            Services; Or Any Other Delay Or Failure Caused By A Third Party, And
            We Will Not Be Liable For Any Resulting Loss Or Damage That You May
            Suffer. In Such An Event, We Reserve The Right To Cancel Or Suspend
            The Service Without Incurring Any Liability.
          </p>
        </section>

        {/* Section 14. LIABILITY */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">14. LIABILITY</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            14.1. TO THE EXTENT PERMITTED BY APPLICABLE LAW, WE WILL NOT
            COMPENSATE YOU FOR ANY REASONABLY FORESEEABLE LOSS OR DAMAGE (EITHER
            DIRECT OR INDIRECT) YOU MAY SUFFER IF WE FAIL TO CARRY OUT OUR
            OBLIGATIONS UNDER THESE TERMS UNLESS WE BREACH ANY DUTIES IMPOSED ON
            US BY LAW (INCLUDING IF WE CAUSE DEATH OR PERSONAL INJURY BY OUR
            NEGLIGENCE) IN WHICH CASE WE SHALL NOT BE LIABLE TO YOU IF THAT
            FAILURE IS ATTRIBUTED TO: (I) YOUR OWN FAULT; (II) A THIRD PARTY
            UNCONNECTED WITH OUR PERFORMANCE OF THESE TERMS (FOR INSTANCE
            PROBLEMS DUE TO COMMUNICATIONS NETWORK PERFORMANCE, CONGESTION, AND
            CONNECTIVITY OR THE PERFORMANCE OF YOUR COMPUTER EQUIPMENT); OR
            (III) ANY OTHER EVENTS WHICH NEITHER WE NOR OUR SUPPLIERS COULD HAVE
            FORESEEN OR FORESTALLED EVEN IF WE OR THEY HAD TAKEN REASONABLE
            CARE. AS THIS SERVICE IS FOR CONSUMER USE ONLY WE WILL NOT BE LIABLE
            FOR ANY BUSINESS LOSSES OF ANY KIND.
          </p>
          <p className="terms-policy-body">
            14.2. IN THE EVENT THAT WE ARE HELD LIABLE FOR ANY EVENT UNDER THESE
            TERMS, OUR TOTAL AGGREGATE LIABILITY TO YOU UNDER OR IN CONNECTION
            WITH THESE TERMS SHALL NOT EXCEED (A) THE VALUE OF THE BETS AND OR
            WAGERS YOU PLACED VIA YOUR ACCOUNT IN RESPECT OF THE RELEVANT
            BET/WAGER OR PRODUCT THAT GAVE RISE TO THE RELEVANT LIABILITY, OR
            (B) EUR €500 IN AGGREGATE, WHICHEVER IS LOWER.
          </p>
          <p className="terms-policy-body">
            14.3. WE STRONGLY RECOMMEND THAT YOU (I) TAKE CARE TO VERIFY THE
            SUITABILITY AND COMPATIBILITY OF THE SERVICE WITH YOUR OWN COMPUTER
            EQUIPMENT PRIOR TO USE; AND (II) TAKE REASONABLE PRECAUTIONS TO
            PROTECT YOURSELF AGAINST HARMFUL PROGRAMS OR DEVICES INCLUDING
            THROUGH INSTALLATION OF ANTI-VIRUS SOFTWARE.
          </p>
        </section>

        {/* Section 15. GAMBLING BY THOSE UNDER AGE */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            15. GAMBLING BY THOSE UNDER AGE
          </h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              If We Suspect That You Are Or Receive Notification That You Are
              Currently Under 18 Years Or Were Under 18 Years (Or Below The Age
              Of Majority As Stipulated In The Laws Of The Jurisdiction
              Applicable To You) When You Placed Any Bets Through The Service
              Your Account Will Be Suspended (Locked) To Prevent You Placing Any
              Further Bets Or Making Any Withdrawals From Your Account. We Will
              Then Investigate The Matter, Including Whether You Have Been
              Betting As An Agent For, Or Otherwise On Behalf, Of A Person Under
              18 Years (Or Below The Age Of Majority As Stipulated In The Laws
              Of The Jurisdiction Applicable To You). If Having Found That You:
              (A) Are Currently; (B) Were Under 18 Years Or Below The Majority
              Age Which Applies To You At The Relevant Time; Or (C) Have Been
              Betting As An Agent For Or At The Behest Of A Person Under 18
              Years Or Below The Majority Age Which Applies: All Winnings
              Currently Or Due To Be Credited To Your Account Will Be Retained;
              All Winnings Gained From Betting Through The Service Whilst Under
              Age Must Be Paid To Us On Demand (If You Fail To Comply With This
              Provision We Will Seek To Recover All Costs Associated With
              Recovery Of Such Sums); And/Or Any Monies Deposited In Your
              Account Which Are Not Winnings Will Be Returned To You OR Retained
              Until You Turn 18 Years Old At Our Sole Discretion. We Reserve The
              Right To Deduct Payment Transaction Fees From The Amount To
              Return, Including Transaction Fees For Deposits To Your
              www.domain_name.com Account Which We Covered.
            </li>
            <li>
              This Condition Also Applies To You If You Are Over The Age Of 18
              Years But You Are Placing Your Bets Within A Jurisdiction Which
              Specifies A Higher Age Than 18 Years For Legal Betting And You Are
              Below That Legal Minimum Age In That Jurisdiction.
            </li>
            <li>
              In The Event We Suspect You Are In Breach Of The Provisions Of
              This Clause Or Are Attempting To Rely On Them For A Fraudulent
              Purpose, We Reserve The Right To Take Any Action Necessary In
              Order To Investigate The Matter, Including Informing The Relevant
              Law Enforcement Agencies.
            </li>
          </ol>
        </section>

        {/* Section 16. FRAUD */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">16. FRAUD</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            We Will Seek Criminal And Contractual Sanctions Against Any Customer
            Involved In Fraud, Dishonesty Or Criminal Acts. We Will Withhold
            Payment To Any Customer Where Any Of These Are Suspected. The
            Customer Shall Indemnify And Shall Be Liable To Pay To Us On Demand
            All Costs, Charges Or Losses Sustained Or Incurred By Us (Including
            Any Direct, Indirect Or Consequential Losses, Loss Of Profit, Loss
            Of Business And Loss Of Reputation) Arising Directly Or Indirectly
            From The Customer's Fraud, Dishonesty Or Criminal Act.
          </p>
        </section>

        {/* Section 17. INTELLECTUAL PROPERTY */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            17. INTELLECTUAL PROPERTY
          </h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              Any Unauthorised Use Of Our Name And Logo May Result In Legal
              Action Being Taken Against You.
            </li>
            <li>
              As Between Us And You, We Are The Sole Owners Of The Rights In And
              To The Service, Our Technology, Software And Business Systems (The
              "Systems") As Well As Our Odds. You Must Not Use Your Personal
              Profile For Your Own Commercial Gain (Such As Selling Your Status
              Update To An Advertiser); And When Selecting A Nickname For Your
              Account We Reserve The Right To Remove Or Reclaim It If We Believe
              It Appropriate.
            </li>
            <li>
              You May Not Use Our URL, Trademarks, Trade Names And/Or Trade
              Dress, Logos ("Marks") And/Or Our Odds In Connection With Any
              Product Or Service That Is Not Ours, That In Any Manner Is Likely
              To Cause Confusion Among Customers Or In The Public Or That In Any
              Manner Disparages Us.
            </li>
            <li>
              Except As Expressly Provided In These Terms, We And Our Licensors
              Do Not Grant You Any Express Or Implied Rights, License, Title Or
              Interest In Or To The Systems Or The Marks And All Such Rights,
              License, Title And Interest Specifically Retained By Us And Our
              Licensors. You Agree Not To Use Any Automatic Or Manual Device To
              Monitor Or Copy Web Pages Or Content Within The Service. Any
              Unauthorized Use Or Reproduction May Result In Legal Action Being
              Taken Against You.
            </li>
          </ol>
        </section>

        {/* Section 18. YOUR LICENSE */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">18. YOUR LICENSE</h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              Subject To These Terms And Your Compliance With Them, We Grant To
              You A Non-Exclusive, Limited, Non Transferable And Non
              Sub-Licensable License To Access And Use The Service For Your
              Personal Non-Commercial Purposes Only. Our License To You
              Terminates If Our Agreement With You Under These Terms Ends.
            </li>
            <li>
              Save In Respect Of Your Own Content, You May Not Under Any
              Circumstances Modify, Publish, Transmit, Transfer, Sell,
              Reproduce, Upload, Post, Distribute, Perform, Display, Create
              Derivative Works From, Or In Any Other Manner Exploit, The Service
              And/Or Any Of The Content Thereon Or The Software Contained
              Therein, Except As We Expressly Permit In These Terms Or Otherwise
              On The Website. No Information Or Content On The Service Or Made
              Available To You In Connection With The Service May Be Modified Or
              Altered, Merged With Other Data Or Published In Any Form Including
              For Example Screen Or Database Scraping And Any Other Activity
              Intended To Collect, Store, Reorganise Or Manipulate Such
              Information Or Content.
            </li>
            <li>
              Any Non-Compliance By You With This Clause May Also Be A Violation
              Of Our Or Third Parties' Intellectual Property And Other
              Proprietary Rights Which May Subject You To Civil Liability And/Or
              Criminal Prosecution.
            </li>
          </ol>
        </section>

        {/* Section 19. YOUR CONDUCT AND SAFETY */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            19. YOUR CONDUCT AND SAFETY
          </h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              For Your Protection And Protection Of All Our Customers, The
              Posting Of Any Content On The Service, As Well As Conduct In
              Connection Therewith And/Or The Service, Which Is In Any Way
              Unlawful, Inappropriate Or Undesirable Is Strictly Prohibited
              ("Prohibited Behaviour").
            </li>
            <li>
              If You Engage In Prohibited Behaviour, Or We Determine In Our Sole
              Discretion That You Are Engaging In Prohibited Behaviour, Your
              Account And/Or Your Access To Or Use Of The Service May Be
              Terminated Immediately Without Notice To You. Legal Action May Be
              Taken Against You By Another Customer, Other Third Party,
              Enforcement Authorities And/Or Us With Respect To You Having
              Engaged In Prohibited Behaviour.
            </li>
            <li>
              Prohibited Behaviour Includes, But Is Not Limited To, Accessing Or
              Using The Service To: Promote Or Share Information That You Know
              Is False, Misleading Or Unlawful; Conduct Any Unlawful Or Illegal
              Activity, Such As, But Not Limited To, Any Activity That Furthers
              Or Promotes Any Criminal Activity Or Enterprise, Violates Another
              Customer's Or Any Other Third Party's Privacy Or Other Rights Or
              That Creates Or Spreads Computer Viruses; Harm Minors In Any Way;
              Transmit Or Make Available Any Content That Is Unlawful, Harmful,
              Threatening, Abusive, Tortuous, Defamatory, Vulgar, Obscene, Lewd,
              Violent, Hateful, Or Racially Or Ethnically Or Otherwise
              Objectionable; Transmit Or Make Available Any Content That The
              User Does Not Have A Right To Make Available Under Any Law Or
              Contractual Or Fiduciary Relationship, Including Without
              Limitation, Any Content That Infringes A Third Party's Copyright,
              Trademark Or Other Intellectual Property And Proprietary Rights;
              Transmit Or Make Available Any Content Or Material That Contains
              Any Software Virus Or Other Computer Or Programming Code
              (Including HTML) Designed To Interrupt, Destroy Or Alter The
              Functionality Of The Service, Its Presentation Or Any Other
              Website, Computer Software Or Hardware; Interfere With, Disrupt Or
              Reverse Engineer The Service In Any Manner, Including, Without
              Limitation, Intercepting, Emulating Or Redirecting The
              Communication Protocols Used By Us, Creating Or Using Cheats, Mods
              Or Hacks Or Any Other Software Designed To Modify The Service, Or
              Using Any Software That Intercepts Or Collects Information From Or
              Through The Service; Retrieve Or Index Any Information From The
              Service Using Any Robot, Spider Or Other Automated Mechanism;
              Participate In Any Activity Or Action That, In The Sole And Entire
              Unfettered Discretion Of Us Results Or May Result In Another
              Customer Being Defrauded Or Scammed; Transmit Or Make Available
              Any Unsolicited Or Unauthorised Advertising Or Mass Mailing Such
              As, But Not Limited To, Junk Mail, Instant Messaging, "Spim",
              "Spam", Chain Letters, Pyramid Schemes Or Other Forms Of
              Solicitations; Create Accounts On The Website By Automated Means
              Or Under False Or Fraudulent Pretences; Impersonate Another
              Customer Or Any Other Third Party, Or Any Other Act Or Thing Done
              That We Reasonably Consider To Be Contrary To Our Business
              Principles. The Above List Of Prohibited Behaviour Is Not
              Exhaustive And May Be Modified By Us At Any Time Or From Time To
              Time. We Reserve The Right To Investigate And To Take All Such
              Actions As We In Our Sole Discretion Deem Appropriate Or Necessary
              Under The Circumstances, Including Without Limitation Deleting The
              Customer's Posting(S) From The Service And/Or Terminating Their
              Account, And Take Any Action Against Any Customer Or Third Party
              Who Directly Or Indirectly In, Or Knowingly Permits Any Third
              Party To Directly Or Indirectly Engage In Prohibited Behaviour,
              With Or Without Notice To Such Customer Or Third Party.
            </li>
          </ol>
        </section>

        {/* Section 20. LINKS TO OTHER WEBSITES */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            20. LINKS TO OTHER WEBSITES
          </h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            The Service May Contain Links To Third Party Websites That Are Not
            Maintained By, Or Related To, Us, And Over Which We Have No Control.
            Links To Such Websites Are Provided Solely As A Convenience To
            Customers, And Are In No Way Investigated, Monitored Or Checked For
            Accuracy Or Completeness By Us. Links To Such Websites Do Not Imply
            Any Endorsement By Us Of, And/Or Any Affiliation With, The Linked
            Websites Or Their Content Or Their Owner(S). We Have No Control Over
            Or Responsibility For The Availability Nor Their Accuracy,
            Completeness, Accessibility And Usefulness. Accordingly When
            Accessing Such Websites We Recommend That You Should Take The Usual
            Precautions When Visiting A New Website Including Reviewing Their
            Privacy Policy And Terms Of Use.
          </p>
        </section>

        {/* Section 21. COMPLAINTS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">21. COMPLAINTS</h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              If You Have Any Concerns Or Questions Regarding These Terms You
              Should Contact Our Customer Service Department Via The Links On
              The Website And Use Your Registered Email Address In All
              Communication With Us.
            </li>
            <li>
              NOTWITHSTANDING THE FOREGOING, WE TAKE NO LIABILITY WHATSOEVER TO
              YOU OR TO ANY THIRD PARTY WHEN RESPONDING TO ANY COMPLAINT THAT WE
              RECEIVED OR TOOK ACTION IN CONNECTION THEREWITH.
            </li>
            <li>
              If A Customer Is Not Satisfied With How A Bet Has Been Settled
              Then The Customer Should Provide Details Of Their Grievance To Our
              Customer Service Department. We Shall Use Our Reasonable
              Endeavours To Respond To Queries Of This Nature Within A Few Days
              (And In Any Event We Intend To Respond To All Such Queries Within
              28 Days Of Receipt).
            </li>
            <li>
              Disputes Must Be Lodged Within Three (3) Days From The Date The
              Wager In Question Has Been Decided. No Claims Will Be Honoured
              After This Period. The Customer Is Solely Responsible For Their
              Account Transactions.
            </li>
            <li>
              In The Event Of A Dispute Arising Between You And Us Our Customer
              Service Department Will Attempt To Reach An Agreed Solution.
              Should Our Customer Service Department Be Unable To Reach An
              Agreed Solution With You, The Matter Will Be Escalated To Our
              Management.
            </li>
            <li>
              Should All Efforts To Resolve A Dispute To The Customer's
              Satisfaction Have Failed, The Customer Has The Right To Lodge A
              Complaint With Our Licensing Body Gaming Services Provider N.V.
            </li>
          </ol>
        </section>

        {/* Section 22. ASSIGNMENT */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">22. ASSIGNMENT</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            Neither These Terms Nor Any Of The Rights Or Obligations Hereunder
            May Be Assigned By You Without The Prior Written Consent Of Us,
            Which Consent Will Not Be Unreasonably Withheld. We May, Without
            Your Consent, Assign All Or Any Portion Of Our Rights And
            Obligations Hereunder To Any Third Party Provided Such Third Party
            Is Able To Provide A Service Of Substantially Similar Quality To The
            Service By Posting Written Notice To This Effect On The Service.
          </p>
        </section>

        {/* Section 23. SEVERABILITY */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">23. SEVERABILITY</h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            In The Event That Any Provision Of These Terms Is Deemed By Any
            Competent Authority To Be Unenforceable Or Invalid, The Relevant
            Provision Shall Be Modified To Allow It To Be Enforced In Line With
            The Intention Of The Original Text To The Fullest Extent Permitted
            By Applicable Law. The Validity And Enforceability Of The Remaining
            Provisions Of These Terms Shall Not Be Affected.
          </p>
        </section>

        {/* Section 24. BREACH OF THESE TERMS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            24. BREACH OF THESE TERMS
          </h2>
          <div className="terms-policy-section-line" />
          <p className="terms-policy-body">
            Without Limiting Our Other Remedies, We May Suspend Or Terminate
            Your Account And Refuse To Continue To Provide You With The Service,
            In Either Case Without Giving You Prior Notice, If, In Our
            Reasonable Opinion, You Breach Any Material Term Of These Terms.
            Notice Of Any Such Action Taken Will, However, Be Promptly Provided
            To You.
          </p>
        </section>

        {/* Section 25. GENERAL PROVISIONS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">25. GENERAL PROVISIONS</h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>
              Term Of Agreement. These Terms Shall Remain In Full Force And
              Effect While You Access Or Use The Service Or Are A Customer Or
              Visitor Of The Website. These Terms Will Survive The Termination
              Of Your Account For Any Reason.
            </li>
            <li>
              Gender. Words Importing The Singular Number Shall Include The
              Plural And Vice Versa, Words Importing The Masculine Gender Shall
              Include The Feminine And Neuter Genders And Vice Versa And Words
              Importing Persons Shall Include Individuals, Partnerships,
              Associations, Trusts, Unincorporated Organisations And
              Corporations.
            </li>
            <li>
              Waiver. No Waiver By Us, Whether By Conduct Or Otherwise, Of A
              Breach Or Threatened Breach By You Of Any Term Or Condition Of
              These Terms Shall Be Effective Against, Or Binding Upon, Us Unless
              Made In Writing And Duly Signed By Us, And, Unless Otherwise
              Provided In The Written Waiver, Shall Be Limited To The Specific
              Breach Waived. The Failure Of Us To Enforce At Any Time Any Term
              Or Condition Of These Terms Shall Not Be Construed To Be A Waiver
              Of Such Provision Or Of The Right Of Us To Enforce Such Provision
              At Any Other Time.
            </li>
            <li>
              Acknowledgement. By Hereafter Accessing Or Using The Service, You
              Acknowledge Having Read, Understood And Agreed To Each And Every
              Paragraph Of These Terms. As A Result, You Hereby Irrevocably
              Waive Any Future Argument, Claim, Demand Or Proceeding To The
              Contrary Of Anything Contained In These Terms.
            </li>
            <li>
              Language. In The Event Of There Being A Discrepancy Between The
              English Language Version Of These Rules And Any Other Language
              Version, The English Language Version Will Be Deemed To Be
              Correct.
            </li>
            <li>
              Governing Law. These Terms Are Exclusively Governed By The Law In
              Force In Curaçao.
            </li>
            <li>
              Entire Agreement. These Terms Constitute The Entire Agreement
              Between You And Us With Respect To Your Access To And Use Of The
              Service, And Supersedes All Other Prior Agreements And
              Communications, Whether Oral Or Written With Respect To The
              Subject Matter Hereof.
            </li>
            <li>
              You Cannot Transfer, Sell, Or Pledge Your Account To Another
              Person. This Prohibition Includes The Transfer Of Any Assets Of
              Value Of Any Kind, Including But Not Limited To Ownership Of
              Accounts, Winnings, Deposits, Bets, Rights And/Or Claims In
              Connection With These Assets, Legal, Commercial Or Otherwise. The
              Prohibition On Said Transfers Also Includes However Is Not Limited
              To The Encumbrance, Pledging, Assigning, Usufruct, Trading,
              Brokering, Hypothecation And/Or Gifting In Cooperation With A
              Fiduciary Or Any Other Third Party, Company, Natural Or Legal
              Individual, Foundation And/Or Association In Any Way Shape Or Form
            </li>
          </ol>
        </section>

        {/* Section 26. CASINO PAYOUT RESTRICTIONS */}
        <section className="terms-policy-section">
          <h2 className="terms-policy-section-title">
            26. CASINO PAYOUT RESTRICTIONS
          </h2>
          <div className="terms-policy-section-line" />
          <ol
            className="terms-policy-list"
            style={{
              listStyleType: "decimal",
              paddingLeft: "20px",
              color: "#fff",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <li>Restriction of payout is applicable for all Casino games</li>
            <li>
              In Single round, User is eligible for a max payout of 100 times
              his bet amount, example if the bet is 100 then max payout shall be
              100 X 100 = 10000, any winning above this multiplier shall not be
              paid out by the company.
            </li>
            <li>
              Another restriction is max payout amount is capped at 2,00,00,000
              (2 Crore points) , if net winning amount is beyond this amount
              then user shall be paid only this amount as max winning in Casino
              games.
            </li>
          </ol>
        </section>

        {/* NOTE section - teal background, NOTE: white, list items orange */}

        <p className="terms-policy-note-heading" style={{ color: "#fff" }}>
          NOTE:
        </p>
        <ol className="terms-policy-note-list" style={{ color: "#fff" }}>
          <li>
            1.Players using VPN and login from different IP frequently may
            result to void bets.
          </li>
          <li>
            And on the basis of different IP from multiple city we can suspend
            the account and void bets.
          </li>
        </ol>
      </div>

      <style jsx>{`
        .terms-policy-page {
          background: #122036;
          padding: 10px;
          margin: 10px;
          display: flex;
          justify-content: flex-start;
          width: fit-content;
        }
        .terms-policy-inner {
          flex: 0 0 100%;
          background: #122036;
          padding: 10px;
          max-width: 100%;
          margin: 10px;
          align-self: flex-start;
          box-sizing: border-box;
        }

        .terms-policy-header {
          background: #071123;
          border: 1px solid #04a0e2;
          border-radius: var(--border-radius, 20px);
          overflow: hidden;
          display: flex;
          align-items: center;
          height: 32px;
          width: 100%;
        }

        .terms-policy-header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 5px;
          background: #000;
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .terms-policy-icon-svg {
          height: 15px;
          width: 15px;
          border-radius: 50%;
          -webkit-filter: var(--reports-header-icon-color);
          filter: var(--reports-header-icon-color);
          color: #fff; /* fallback color */
        }

        .terms-policy-title {
          margin-left: 5px;
          color: #fff;
          font-size: 13px;

          text-transform: uppercase;
          font-family: "Lato";
        }
        .terms-policy-note {
          background: #008c95;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 24px;
          color: #000000;
          margin-top: 10px;
        }

        .terms-policy-note-heading {
          font-size: 12px;
        }

        .terms-policy-note-list {
          margin: 0;
          font-size: 12px;
        }

        .terms-policy-note-list li {
          margin-bottom: 8px;
        }

        .terms-policy-note-list li:last-child {
          margin-bottom: 0;
        }

        .terms-policy-section {
          margin-bottom: 24px;
        }

        .terms-policy-section-title {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 900;
          color: #01fafe;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 10px 0 0 !important;
        }

        .terms-policy-section-line {
          width: 100%;
          height: 1px;
          background: ${TEAL_LIGHT};
          margin-bottom: 12px;
          opacity: 0.8;
        }

        .terms-policy-body {
          font-size: 13px;
          color: #fff;
        }

        .terms-policy-list {
          margin: 8px 0 0 0;
        }

        .terms-policy-list li {
          margin-bottom: 8px;
        }

        @media (min-width: 768px) {
          .terms-policy-page {
            padding: 24px;
            --ion-grid-columns: 12;
          }
          .terms-policy-inner {
            flex: 0 0 calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
            width: calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
            max-width: calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
          }

          .terms-policy-section-title {
            font-size: 14px;
          }
          .terms-policy-body {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
}

export default TermsPolicy;
