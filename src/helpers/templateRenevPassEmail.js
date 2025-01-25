const today = new Date();
const formattedDate = today.toISOString().split("T")[0];

const templateRenewPassEmail = (confirmationLink, userName, password) => {
  return `<!DOCTYPE html>
<html lang="uk">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Емейл розсилка</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #7F56D9;
            color: #F6F6F8;
        }

        .email-container {
            width: 100%;
         
            margin: 0 auto;
            background-color: #7F56D9;
            border-radius: 8px;
            overflow: hidden;
            text-align: center;
        }

        .logo {
            margin: 80px auto 32px;
            width: 228px;
            height: 96px;
        }

        .content h1 {
            font-family: 'Manrope', sans-serif;
            font-weight: 700;
            font-size: 52px;
            line-height: 1;
            text-transform: uppercase;
            color: #FFFFFF;
            margin-bottom: 40px;
        }

        .text-box {
            text-align: left;
            border-radius: 40px;
            padding: 40px;
            width: 80%;
            max-width: 1200px;
            margin: 0 auto 40px;
            background: #fafafa;
            color: #1d1d39;
            box-shadow: 0 8px 56px rgba(200, 208, 216, 0.08);
            font-family: 'Manrope', sans-serif;
        }

        .contentB {
            margin-bottom: 16px;
            font-family: 'Manrope', sans-serif;
            font-weight: 500;
            font-size: 16px;
            line-height: 1.4;
            color: #F6F6F8;
        }

        .contentB a {
            color: #F6F6F8;
            text-decoration: none;
            margin-right: 40px;
        }

        .footer {
            text-align: center;
            font-size: 14px;
        }

        .footer p {
            font-family: 'Manrope', sans-serif;
            font-weight: 500;
            font-size: 16px;
            line-height: 1.4;
            color: #D6BBFB;
        }

        @media (max-width: 768px) {
            .logo {
                width: 109px;
                height: 48px;
            }

            .content h1 {
                font-size: 26px;
                line-height: 1.1;
                margin-bottom: 40px;
            }

            .text-box {
                width: 90%;
                padding: 24px;
                border-radius: 24px;
                font-size: 18px;
            }

            .contentB {
                font-size: 14px;
                line-height: 1.5;
            }

            .footer p {
                font-size: 14px;
                line-height: 1.5;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <header>
            <img src="https://test-backend.stravaporuch.com.ua/images/logo-rounded.png" alt="STRAVA PORUCH"
                class="logo">
        </header>

        <!-- Main Content -->
        <main class="content">
            <h1 style="color: #FFFFFF; margin:0;">Surprising Savings in Every Bag!</h1>

            <div class="text-box">
                <h4>Discover Fresh Surprise Bags and Save on Delicious Food!</h4>
                <p>Thank you for choosing Strava Poruch to help reduce food waste and enjoy delicious savings! Here’s
                    what’s new and fresh:</p>
                <p>✨ Discover New Bags Near You! Explore a variety of surprise bags filled with fresh goodies – just
                    waiting for you at a discount. Log in now to check out the latest options in your area.</p>
                <p>🌟 Highlights of the Week: See top-rated surprise bags that our users love, from fresh produce to
                    bakery treats. Don’t miss out!</p>
                <p>📅 Quick Tips: How to Reserve Your Bag:</p>
                <ol>
                    <li>Open the Strava Poruch app and view the latest surprise bags.</li>
                    <li>Reserve and pick up at your chosen time.</li>
                    <li>Enjoy delicious food while reducing waste!</li>
                </ol>
            </div>

            <div class="contentB">
                <a href="https://stravaporuch.com.ua" target="_blank">https://stravaporuch.com.ua</a>
                <span>+38 (067) 123-45-67</span>
            </div>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <p>&copy; 2024 STRAVA PORUCH. Усі права захищені</p>
        </footer>
    </div>
</body>

</html>
`;
};
module.exports = { templateRenewPassEmail };
