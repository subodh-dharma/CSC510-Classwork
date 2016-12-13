package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.AfterClass;

import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class WebTest {
	private static WebDriver driver;

	@BeforeClass
	public static void setUp() throws Exception {
		// driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}

	@AfterClass
	public static void tearDown() throws Exception {
		driver.close();
		driver.quit();
	}

	// test to count the particpant count is 55
	@Test
	public void participantCount() throws Exception {
		driver.get("http://www.checkbox.io/studies.html");
		int countParticipant = 0;

		// http://geekswithblogs.net/Aligned/archive/2014/10/16/selenium-and-timing-issues.aspx
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[@class='status']/span[.='CLOSED']")));
		List<WebElement> spans = driver.findElements(By.xpath("//a[@class='status']/span[.='CLOSED']"));
		List<WebElement> titles = driver.findElements(By.xpath("//div[contains(@class, 'span8')]/h3"));
		for (WebElement title : titles) {
			if (title.getText().equals("Frustration of Software Developers")) {
				WebElement cntPart = title.findElement(By.xpath(
						"..//following-sibling::div[contains(@class, 'span4')]//span[contains(@class, 'backers')]"));
				countParticipant = Integer.parseInt(cntPart.getText());
			}
		}

		assertNotNull(spans);
		//assertEquals(5, spans.size());
		assertEquals(55, countParticipant);
	}

	// Check the number of Studies closed is 5
	@Test
	public void numberOfClosedStudies() {
		driver.get("http://www.checkbox.io/studies.html");
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[@class='status']/span[.='CLOSED']")));

		List<WebElement> status = driver.findElements(By.xpath("//a[@class='status']/span[text()='CLOSED']"));

		assertEquals(5, status.size());

	}

	
	//clicking the participate button
	@Test
	public void clickParticipateButton() {
		driver.get("http://www.checkbox.io/studies.html");
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[@class='status']/span[.='CLOSED']")));

		List<WebElement> statuses = driver.findElements(By.xpath("//a[@class='status']/span[text()='OPEN']"));
		for (WebElement status : statuses) {
			WebElement s = status.findElement(By.xpath("..//following-sibling::div//button[@class='btn btn-info']"));
			try {
				s.click();
				assert (true);
			} catch (Exception e) {
				fail("Button not available");
			}

		}
	}

	// checking the amazon award image
	@Test
	public void checkAmazonAward() {
		try {
			driver.get("http://www.checkbox.io/studies.html");
			WebDriverWait wait = new WebDriverWait(driver, 30);
			wait.until(
					ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[@class='status']/span[.='CLOSED']")));

			// parse to html tag with text = "Software Changes Survey"
			WebElement surveyTitle = driver
					.findElement(By.xpath("//div[contains(@class,'span8')]/h3/span[text()='Software Changes Survey']"));
			WebElement award = surveyTitle
					.findElement(By.xpath("..//following-sibling::div[@class='award']/div/span/img"));// [@src=\"/media/amazongc-micro.jpg\"]
			String src = award.getAttribute("src");
			
			if (src.contains("amazongc-micro.jpg")) {
				assertTrue("Contains!!", true);
			} else {
				assertFalse("Absent!!", true);
			}
		} catch (Exception e) {
			fail("No Such element found");
		}

	}

}
